var r = require('./../helpers/response'),
    sanitize = require('./../helpers/sanitize');

module.exports = function(server, model, config) {

    /**
     * GET: /dashboard/:name
     * Get dashboard and widget by :name
     */
    server.get('/dashboard/:name', function create(req, res, next) {

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

        var query  = model.Dashboard.where({ name: req.params.name });
        query.findOne(function (err, dashboard) {
            if (dashboard) {
                findWidgets(dashboard.widgets, function(widgets) {

                    dashboard.widgets = [];
                    widgets.forEach(function(item) {
                        dashboard.widgets.push(sanitize(item));
                    });

                    r.ok(res, dashboard);
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

    /**
     * POST: /dashboard/:name
     * Create new dashboard with :name
     */
    server.post('/dashboard/:name', function(req, res, next) {

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
     * GET: /dashboards
     * Get the list of dashboards
     */
    server.get('/dashboards', function(req, res, next) {
        var query  = model.Dashboard.where({});

        query.find(function (err, dashboards) {
            if (dashboards) {
                var sanitized = [];

                dashboards.forEach(function(_dashboard) {
                    sanitized.push(sanitize(_dashboard));
                });

                r.ok(res, sanitized);
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