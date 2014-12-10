var r = require('./../helpers/response'),
    endpoint = '/dashboard/:dashboard/widget/:widget';

module.exports = function(server, model) {

    server.post(endpoint, function(req, res, next) {

        function createWidget(dashboard) {
            var widget = new model.Widget({
                type: req.params.type
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