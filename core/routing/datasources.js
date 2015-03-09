var helpers = require('./../helpers'),
    r = helpers.response,
    auth = helpers.auth,
    Promise = require('promise'),
    ObjectId = require('mongoose').Types.ObjectId,
    extend = require('util')._extend;

module.exports = function(server, model, config) {

    /**
     * GET: /api/datasources/types
     * Get the list of available datasources
     */
    server.get('/api/datasources/types', function(req, res, next) {
        r.ok(res, { datasourcesTypes: config.datasourcesTypes });
        return next();
    });

    /**
     * POST: /api/datasource
     * Create new datasource
     *
     * AUTH: unauthorised users can't create datasources
     *
     * post body:
     *  - type {string} one of datasources types [required]
     *  - widgetId {string} ObjectId of widget to attach [required]
     *  - ... params that datasource require
     */
    server.post('/api/datasource', function(req, res, next) {

        auth.check(req, res, next, config);

        var type = req.params.type;
        if (type) type = type.toUpperCase();

        if (config.datasourcesTypes.indexOf(type) === -1) {
            r.fail(res, {
                message: "Datasource type is invalid. Available types: " + config.datasourcesTypes.join()
            }, 400);
            return next();
        }

        model.Widget.get(req.params.widgetId)
            .then(function (widget) {

                var datasource = new model.Datasource({
                    type: type,
                    widget: widget._id,
                    url: req.params.url
                });

                datasource.save(function (err, data) {
                    if (err) r.fail(res, err, 400);
                    else r.ok(res, data);
                    return next();
                });
            })
            .catch(function(err) {
                r.fail(res, err);
                return next();
            });

    });
};