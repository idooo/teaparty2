var r = require('./../helpers/response');

module.exports = function(server, model, config) {

    /**
     * POST: /api/push/:widgetToken
     * post body:
     *  - data {json object}
     */
    server.post('/api/push/:token', function(req, res, next) {

        function getToken(req) {
            if (req.is('application/json')) {
                var tokenMatch = req.url.match(/\/([^\/]+$)/);
                if (tokenMatch.length === 2) return tokenMatch[1];
            }
            return req.params.token;
        }

        function extractBodyData(rawData) {
            try {
                if (req.is('application/json')) return req.body;
                return JSON.parse(rawData.toString());
            }
            catch (e) {
                r.fail(res, {message: "JSON data is not valid", details: e}, 400);
                next();
            }
        }

        var query  = model.Widget.where({ key: getToken(req) });
        query.findOne(function (err, widget) {

            if (typeof req.body === 'undefined') {
                r.fail(res, {message: "No data to push"}, 400);
                return next();
            }
            else if (widget) {
                var data = extractBodyData(req.body);

                widget.pushData(data)
                    .then(function() {
                        r.ok(res, {message: "Widget data was updated"});
                        return next();
                    })
                    .catch(function(err) {
                        r.fail(res, err);
                        return next();
                    });
            }
            else {
                if (err) r.fail(res, err);
                else r.fail(res);
                return next();
            }
        });
    });
};