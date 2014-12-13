var r = require('./../helpers/response');

module.exports = function(server, model) {

    /**
     * POST: /api/dashboard/:dashboard/widget/:widget
     * Create new widget with :type for selected :dashboard
     *
     * post body:
     *  - type
     *  - caption
     *  - datasource
     */
    server.post('/api/dashboard/:dashboard/widget/:type', function(req, res, next) {

        function createWidget(dashboard) {
            var widget = new model.Widget({
                type: req.params.type,
                caption: req.params.caption, // TODO: sanitise
                datasource: req.params.datasource // TODO: validation?
            });

            widget.save(function (err, data) {
                if (err) {
                    r.fail(res, err, 400);
                    return next();
                }
                else addWidgetToDashboard(data, dashboard)
            });
        }

        function addWidgetToDashboard(widget, dashboard) {
            dashboard.widgets.push(widget._id);

            dashboard.save(function (err) {
                if (err) r.fail(res, err, 400);
                else r.ok(res, widget);

                return next();
            });
        }

        var query  = model.Dashboard.where({ name: req.params.dashboard });

        query.findOne(function (err, dashboard) {
            if (dashboard) createWidget(dashboard);
            else {
                if (err) r.fail(res, err);
                else r.fail(res);

                return next();
            }
        });
    });
};