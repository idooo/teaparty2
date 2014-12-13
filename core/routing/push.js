var r = require('./../helpers/response');

module.exports = function(server, model, config) {

    /**
     * POST: /api/push/:widgetToken
     * post body:
     *  - data {json object}
     */
    server.post('/api/push/:token', function(req, res, next) {

        function extractBodyData(rawData) {
            try {
                return JSON.parse(rawData);
            }
            catch (e) {
                r.fail(res, {message: "JSON data is not valid"}, 400);
                next();
            }
        }

        function pushData(widget, rawData) {
            var data = extractBodyData(rawData);

            r.ok(res);

            // TODO: validation stuff
            // TODO: add check that data was saved
            widget.data = data;
            widget.last_update_date = new Date();
            widget.save();

            return next();
        }

        var query  = model.Widget.where({ key: req.params.token });
        query.findOne(function (err, widget) {
            if (typeof req.body === 'undefined') {
                r.fail(res, {message: "No data to push"}, 400);
                return next();
            }
            else if (widget) pushData(widget, req.body.toString());
            else {
                if (err) r.fail(res, err);
                else r.fail(res);

                return next();
            }
        });
    });
};