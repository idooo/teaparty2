var helpers = require('./../helpers'),
    r = helpers.response,
    auth = helpers.auth,
    ObjectId = require('mongoose').Types.ObjectId,
    extend = require('util')._extend;

module.exports = function(server, model, config) {

    /**
     * GET: /api/dashboard/:dashboardId
     * Get dashboard by :dashboardId
     *
     * AUTH: not authorised users can't get private=true dashboards
     */
    server.get('/api/dashboard/:dashboardId', function create(req, res, next) {

        var query = { _id: ObjectId(req.params.dashboardId) };
        if (!auth.isAuthorised(req, config)) {
            query.private = { $ne: true }
        }

        query = model.Dashboard.where(query);
        query.findOne(function (err, dashboard) {
            if (dashboard) {
                var _widgets = {};
                dashboard.widgets.forEach(function(w) {
                    _widgets[w._id] = {
                        position: w.position,
                        size: w.size
                    }
                });

                findWidgets(Object.keys(_widgets), function(widgets) {
                    var filter;
                    if (!auth.isAuthorised(req, config)) filter = ['key'];

                    dashboard.widgets = [];

                    widgets.forEach(function(item) {
                        dashboard.widgets.push(extend(helpers.sanitize(item, filter), _widgets[item._id]));
                    });

                    r.ok(res, dashboard);
                    return next();
                });
            }
            else {
                if (err) r.fail(res, err, 400);
                else r.fail(res);

                return next();
            }
        });

        function findWidgets(ids, callback) {
            var query = model.Widget.where({ _id: {$in: ids }});
            query.find(function (err, widgets) {
                if (err) {
                    r.fail(res, err);
                    return next();
                }

                if (typeof callback !== 'undefined') callback(widgets);
            })
        }
    });

    /**
     * POST: /api/dashboard
     * Create new dashboard
     *
     * AUTH: not authorised users can't create dashboards
     *
     * post body:
     *  - name {string}
     *  - private {boolean}
     */
    server.post('/api/dashboard', function(req, res, next) {

        auth.check(req, res, next, config);

        var dashboard = new model.Dashboard({
            'name': req.params.name,
            'private': req.params.private
        });

        dashboard.save(function (err, data) {
            if (err) {
                var message = "Unknown backend error";
                if (err.code === 11000) message = "Dashboard with this name already exists";
                r.fail(res, {message: message}, 400);
            }
            else r.ok(res, data);

            return next();
        });
    });

    /**
     * DELETE: /api/dashboard/:dashboardId
     * Delete dashboard by name
     *
     * AUTH: not authorised users can't delete dashboards
     */
    server.del('/api/dashboard/:dashboardId', function(req, res, next) {

        auth.check(req, res, next, config);

        var query  = model.Dashboard.where({ _id: ObjectId(req.params.dashboardId) });
        query.findOneAndRemove(function (err, dashboard) {
            if (dashboard) r.ok(res);
            else {
                if (err) r.fail(res, err, 400);
                else r.fail(res);
            }

            return next();
        });
    });

    /**
     * PUT: /api/dashboard/:dashboardId
     * Change dashboard settings
     *
     * AUTH: not authorised users can't change dashboard settings
     *
     * post body:
     * - name (string)
     * - private (boolean)
     * - columns (number)
     * - url (any value -> url will be regenerated)
     */
    server.put('/api/dashboard/:dashboardId', function(req, res, next) {

        auth.check(req, res, next, config);

        var paramNames = ['name', 'private', 'columns'],
            regenerateUrlName = 'url',
            updateObj = {};

        var query = model.Dashboard.where({ _id: ObjectId(req.params.dashboardId)});

        paramNames.forEach(function(paramName) {
            if (typeof req.params[paramName] !== 'undefined') updateObj[paramName] = req.params[paramName];
        });

        if (typeof req.params[regenerateUrlName] !== 'undefined') {
            updateObj[regenerateUrlName] = model.Dashboard.getUrl()
        }

        query.findOneAndUpdate(updateObj, function (err, dashboard) {
            if (dashboard) r.ok(res, dashboard);
            else {
                if (err) r.fail(res, err);
                else r.fail(res, { message: "Dashboard not found" });
            }
            return next();
        });
    });

    /**
     * GET: /api/dashboards
     * Get the list of dashboards
     *
     * AUTH: not authorised users can't see private=true dashboards in the list
     */
    server.get('/api/dashboards', function(req, res, next) {

        var query = {};
        if (!auth.isAuthorised(req, config)) {
            query.private = { $ne: true }
        }

        query = model.Dashboard.where(query);
        query.find(function (err, dashboards) {
            if (dashboards) {
                var sanitized = [];

                dashboards.forEach(function(_dashboard) {
                    sanitized.push(helpers.sanitize(_dashboard));
                });

                r.ok(res, sanitized.sort(function(a, b) { return a.name > b.name }));
                return next();
            }
            else {
                if (err) r.fail(res, err);
                else r.fail(res);

                return next();
            }
        });
    });
};