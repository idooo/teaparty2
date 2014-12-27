var helpers = require('./../helpers'),
    r = helpers.response,
    auth = helpers.auth,
    extend = require('util')._extend;

module.exports = function(server, model, config) {

    /**
     * GET: /api/dashboard/:name
     * Get dashboard and widget by :name
     *
     * AUTH: not authorised users can't get private=true dashboards
     */
    server.get('/api/dashboard/:name', function create(req, res, next) {

        var query = { name: req.params.name };
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
                    dashboard.widgets = [];
                    widgets.forEach(function(item) {
                        dashboard.widgets.push(extend(helpers.sanitize(item), _widgets[item._id]));
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
     * POST: /api/dashboard/:name
     * Create new dashboard with :name
     *
     * AUTH: not authorised users can't create dashboards
     */
    server.post('/api/dashboard/:name', function(req, res, next) {

        auth.check(req, res, next, config);

        var dashboard = new model.Dashboard({
            name: req.params.name,
            private: req.params.private
        });

        dashboard.save(function (err, data) {
            if (err) r.fail(res, err, 400);
            else r.ok(res, data);

            return next();
        });
    });

    /**
     * DELETE: /api/dashboard/:name
     * Delete dashboard by name
     *
     * AUTH: not authorised users can't delete dashboards
     */
    server.del('/api/dashboard/:name', function(req, res, next) {

        auth.check(req, res, next, config);

        var query  = model.Dashboard.where({ name: req.params.name });
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