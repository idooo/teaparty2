var helpers = require('./../helpers'),
    r = helpers.response,
    auth = helpers.auth,
    Promise = require('promise'),
    ObjectId = require('mongoose').Types.ObjectId,
    extend = require('util')._extend;

module.exports = function(server, model, config) {

    /**
     * POST: /api/dashboard/:dashboardId/widget/:widgetId
     * Add widget :widgetId to :dashboardId
     *
     * AUTH: not authorised users can't modify dashboards
     *
     */
    server.post('/api/dashboard/:dashboardId/widget/:widgetId', function(req, res, next) {

        auth.check(req, res, next, config);

        var dashboard;

        model.Dashboard.get(req.params.dashboardId)
            .then(function (_dashboard) {
                dashboard = _dashboard;
                return model.Widget.get(req.params.widgetId)
            })
            .then(function (widget) {
                return widget.addToDashboard(dashboard);
            })
            .then(function (widget) {
                r.ok(res, widget);
                return next();
            })
            .catch(function(err) {
                r.fail(res, err);
                return next();
            });
    });

    /**
     * DELETE: /api/dashboard/:dashboardId/widget/:widgetId
     * Remove widget :widget from :dashboardId
     *
     * AUTH: not authorised users can't modify dashboards
     */
    server.del('/api/dashboard/:dashboardId/widget/:widgetId', function(req, res, next) {

        auth.check(req, res, next, config);

        var dashboard,
            widget;

        model.Dashboard.get(req.params.dashboardId)
            .then(function (_dashboard) {
                dashboard = _dashboard;
                return model.Widget.get(req.params.widgetId);
            })
            .then(function(_widget) {
                widget = _widget;
                return widget.removeFromDashboard(dashboard);
            })
            .then(function() {
                widget.remove(function(err){
                    if (err) r.fail(res, err, 400);
                    else r.ok(res);
                    return next();
                });
            })
            .catch(function(err) {
                r.fail(res, err);
                return next();
            });
    });

    /**
     * POST: /api/dashboard/:dashboardId/widget/:widgetId/move
     * Move widget inside the :dashboardId by :widgetId
     *
     * AUTH: not authorised users can't move widgets
     *
     * post body:
     *  - object {
     *              "size": {
     *                  "x": 2,
     *                  "y": 2
     *              },
     *              "position": [2,2]
     *           }
     */
    server.post('/api/dashboard/:dashboardId/widget/:widgetId/move', function(req, res, next) {

        auth.check(req, res, next, config);

        var dashboard;

        model.Dashboard.get(req.params.dashboardId)
            .then(function (_dashboard) {
                dashboard = _dashboard;
                return model.Widget.get(req.params.widgetId);
            })
            .then(function(widget) {
                var data = validateData(req.params);
                if (!data) {
                    r.fail(res, {message: "Configuration object is not valid"}, 400);
                    return next();
                }
                return updateDashboardReference(dashboard, widget, data);
            })
            .then(function() {
                r.ok(res);
                return next();
            })
            .catch(function(err) {
                r.fail(res, err);
                return next();
            });

        /**
         * Check if size or position data was changed
         * @param oldData
         * @param newData
         * @returns {boolean}
         */
        function wasDataChanged(oldData, newData) {
            var isChanged = false;

            // TODO: so dirty?
            isChanged = isChanged || (newData.position && oldData.position.toString() !== newData.position.toString());
            isChanged = isChanged || (newData.size && oldData.size.x !== newData.size.x);
            isChanged = isChanged || (newData.size && oldData.size.y !== newData.size.y);

            return isChanged;
        }

        /**
         * Update widgets reference in the dashboard and save it to the db
         * @param dashboard
         * @param widget
         * @param obj
         * @returns {*|EmbeddedDocument}
         */
        function updateDashboardReference(dashboard, widget, obj) {
            return new Promise(function (resolve, reject) {
                var _id = widget._id.toString();
                for (var i=0; i<dashboard.widgets.length; i++) {
                    if (dashboard.widgets[i]._id.toString() === _id) {
                        if (wasDataChanged(dashboard.widgets[i], obj)) {
                            dashboard.widgets.set(i, extend(dashboard.widgets[i], obj));
                            return dashboard.save(function(err, data) {
                                if (err) reject(err);
                                else resolve(data);
                            });
                        }
                    }
                }
                resolve()
            });
        }

        /**
         * Validate input position and size objects
         * @param rawData
         * @returns {{}|false}
         */
        function validateData(rawData) {
            var isPostion = false,
                isSize = false,
                data = {};

            if (Object.prototype.toString.call(rawData.position) === "[object Array]" && rawData.position.length >= 2 ) {
                isPostion = true;
                try {
                    data.position = rawData.position.slice(0, 2).map(function (i) {
                        return parseInt(i, 10)
                    });
                }
                catch (e) {
                    return false;
                }
            }

            if (typeof rawData.size !== 'undefined' && typeof rawData.size.x !== 'undefined'
                && typeof rawData.size.y !== 'undefined') {
                isSize = true;
                data.size = {
                    x: rawData.size.x,
                    y: rawData.size.y
                }
            }
            if (!(isSize || isPostion)) return false;

            return data;
        }

    });

     /**
     * POST: /api/dashboard/:dashboardId/widget/:widgetId/move/:dashboardDestId
     * Move widget from :dashboardId to :dashboardDestId by :widgetId
     *
     * AUTH: not authorised users can't move widgets
     */
    server.post('/api/dashboard/:dashboardId/widget/:widgetId/move/:dashboardDestId', function(req, res, next) {

        auth.check(req, res, next, config);

        var dashboardSrc,
            dashboardDest;

        model.Dashboard.get(req.params.dashboardId)
            .then(function(dashboard) {
                dashboardSrc = dashboard;
                return model.Dashboard.get(req.params.dashboardDestId)
            })
            .then(function(dashboard) {
                dashboardDest = dashboard;
                return model.Widget.get(req.params.widgetId);
            })
            .then(function(widget) {
                return widget.removeFromDashboard(dashboardSrc);
            })
            .then(function(widget) {
                return widget.addToDashboard(dashboardDest);
            })
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
