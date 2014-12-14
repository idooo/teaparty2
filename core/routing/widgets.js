var r = require('./../helpers/response');

module.exports = function(server, model) {

    /**
     * POST: /api/dashboard/:dashboard/widget/
     * Create new widget for selected :dashboard
     *
     * post body:
     *  - type
     *  - caption
     *  - datasource
     */
    server.post('/api/dashboard/:dashboard/widget', function(req, res, next) {

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

    /**
     * DELETE: /api/dashboard/:dashboard/widget/:key
     * Delete widget by :key
     */
    server.del('/api/dashboard/:dashboard/widget/:key', function(req, res, next) {

        function deleteDashboardReference(dashboard, _id, callback) {
            _id = _id.toString();

            for (var i=0; i<dashboard.widgets.length; i++) {
                if (dashboard.widgets[i].toString() === _id) {
                    dashboard.widgets.splice(i, 1);
                }
            }

            dashboard.save(function(err) {
                if (err) r.fail(res, err, 400);
                else if (typeof callback === 'function') callback();
            });
        }

        function findDashboard(name, callback) {
            var query  = model.Dashboard.where({ name: name });
            query.findOne(function (err, dashboard) {
                if (dashboard) {
                    if (typeof callback === 'function') callback(dashboard);
                }
                else {
                    if (err) r.fail(res, err);
                    else r.fail(res);

                    return next();
                }
            });
        }

        var query  = model.Widget.where({ key: req.params.key });
        query.findOne(function (err, widget) {
            if (widget) {
                findDashboard(req.params.dashboard, function(dashboard) {
                    deleteDashboardReference(dashboard, widget._id, function() {
                        widget.remove(function(err, data){
                            if (err) r.fail(res, err, 400);
                            else r.ok(res);

                            return next();
                        });
                    });
                });
            }
            else {
                if (err) r.fail(res, err, 400);
                else r.fail(res);

                return next();
            }
        });
    });

};