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

        function pushData(widget, rawData) {
            var data = extractBodyData(rawData);

            // TODO: add check that data was saved
            if (config.widgets[widget.type]) {
                try {
                    widget.data = validateAndFormat(data, config.widgets[widget.type])
                }
                catch (e) {
                    r.fail(res, {message: "Widget data validation fail"}, 400);
                    return next();
                }
            }
            else {
                widget.data = data;
            }

            widget.last_update_date = new Date();
            widget.save();

            r.ok(res, {message: "Widget data was updated"});
            return next();
        }

        function validateAndFormat(data, ref) {
            if (typeof ref.validate === 'function') {
                if (!ref.validate(data)) {
                    throw "ValidationError";
                }
            }
            if (typeof ref.format === 'function') {
                return ref.format(data);
            }
            return data;
        }

        var query  = model.Widget.where({ key: getToken(req) });
        query.findOne(function (err, widget) {

            if (typeof req.body === 'undefined') {
                r.fail(res, {message: "No data to push"}, 400);
                return next();
            }
            else if (widget) pushData(widget, req.body);
            else {
                if (err) r.fail(res, err);
                else r.fail(res);

                return next();
            }
        });
    });
};