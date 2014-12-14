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

            // TODO: add check that data was saved
            if (config.widgets[widget.type]) {
                try {
                    widget.data = validateAndSanitise(data, config.widgets[widget.type])
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

            return next();
        }

        function validateAndSanitise(data, ref) {
            if (typeof ref.validate === 'function') {
                if (!ref.validate(data)) {
                    throw "ValidationError";
                }
            }
            if (typeof ref.sanitise === 'function') {
                return ref.sanitise(data);
            }
            return data;
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