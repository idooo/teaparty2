var helpers = require('./../helpers'),
    r = helpers.response,
    auth = helpers.auth,
    extend = require('util')._extend;

module.exports = function(server, model, config) {

    /**
     * POST: /api/widget/
     * Create new widget
     *
     * AUTH: not authorised users can't create widgets
     *
     * post body:
     *  - type
     *  - caption
     *  - datasource
     */
    server.post('/api/widget', function(req, res, next) {

        auth.check(req, res, next, config);

        var widget = new model.Widget({
            type: req.params.type,
            caption: req.params.caption, // TODO: sanitise
            datasource: req.params.datasource // TODO: validation?
        });

        widget.save(function (err, widget) {
            if (err) {
                r.fail(res, err, 400);
                return next();
            }
            else {
                r.ok(res, widget);
                return next();
            }
        });

    });

    /**
     * DELETE: /api/widget/:widgetId
     * Delete widget by :widgetId
     */
    server.del('/api/widget/:widgetId', function(req, res, next) {

        auth.check(req, res, next, config);
        r.fail(res, { message: "Not supported yet" }, 400);
        return next();

    });

    /**
     * PUT: /api/widget/:widgetId
     *
     * AUTH: not authorised users can't change widget settings
     *
     * post body:
     * - caption
     */
    server.put('/api/widget/:widgetId', function(req, res, next) {

        auth.check(req, res, next, config);
        r.fail(res, { message: "Not supported yet" }, 400);
        return next();

    });
};
