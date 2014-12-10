var r = require('./../helpers/response'),
    sanitize = require('./../helpers/sanitize'),
    endpoint = '/dashboard/:name';

module.exports = function(server, model) {

    server.get(endpoint, function create(req, res, next) {

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

                    // TODO: Sanitize widgets' fields
                    dashboard.widgets = widgets;
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

    server.post(endpoint, function(req, res, next) {

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
};