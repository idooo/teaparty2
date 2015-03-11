var helpers = require('./../helpers'),
    r = helpers.response,
    auth = helpers.auth,
    Promise = require('promise'),
    ObjectId = require('mongoose').Types.ObjectId;

module.exports = function(server, model, config) {

    /**
     * GET: /api/datasources
     * Get the list of all datasources
     */
    server.get('/api/datasources', function(req, res, next) {
        model.Datasource.getDatasources()
            .then(function(datasources) {
                r.ok(res, datasources);
                return next();
            })
            .catch(function(err) {
                r.fail(res, err);
                return next();
            });
    });

    /**
     * GET: /api/datasource/:datasourceId
     * Get datasource by :datasourceId
     */
    server.get('/api/datasource/:datasourceId', function(req, res, next) {
        model.Datasource.get(req.params.datasourceId)
            .then(function(datasource) {
                r.ok(res, datasource);
                return next();
            })
            .catch(function(err) {
                r.fail(res, err);
                return next();
            });
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

    /**
     * DELETE: /api/datasource/:datasourceId
     * Remove datasource by :datasourceId
     *
     * AUTH: unauthorised users can't remove datasources
     */
    server.del('/api/datasource/:datasourceId', function(req, res, next) {

        auth.check(req, res, next, config);

        model.Datasource.delete(req.params.datasourceId)
            .then(function() {
                r.ok(res);
                return next();
            })
            .catch(function(err) {
                r.fail(res, err);
                return next();
            });

    });
};