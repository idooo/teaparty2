var helpers = require('./../helpers'),
    r = helpers.response,
    auth = helpers.auth,
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

        findDashboard(res, next, req.params.dashboardId, function(dashboard) {

            findWidget(res, next, req.params.widgetId, function (widget) {

                var widget_data = {
                    size: { "x": 1, "y": 1 },
                    position: [0, 0],
                    _id: widget._id
                };

                dashboard.widgets.push(widget_data);

                dashboard.save(function (err) {
                    if (err) r.fail(res, err, 400);
                    else r.ok(res, widget);

                    return next();
                });
            });
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

        findWidget(res, next, req.params.widgetId, function(widget) {

            findDashboard(res, next, req.params.dashboardId, function(dashboard) {

                deleteDashboardReference(dashboard, widget._id, function() {

                    widget.remove(function(err){
                        if (err) r.fail(res, err, 400);
                        else r.ok(res);

                        return next();
                    });
                });
            });
        });

        function deleteDashboardReference(dashboard, _id, callback) {
            _id = _id.toString();

            for (var i=0; i<dashboard.widgets.length; i++) {
                if (dashboard.widgets[i]._id.toString() === _id) {
                    dashboard.widgets.splice(i, 1);
                }
            }

            dashboard.save(function(err) {
                if (err) r.fail(res, err, 400);
                else if (typeof callback === 'function') callback();
            });
        }

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

        findWidget(res, next, req.params.widgetId, function(widget) {

            findDashboard(res, next, req.params.dashboardId, function(dashboard) {

                var obj = validateData(req.params);
                if (!obj) {
                    r.fail(res, {message: "Configuration object is not valid"}, 400);
                    return next();
                }

                updateDashboardReference(dashboard, widget._id, obj, function() {
                    r.ok(res);
                    return next();
                });
            });
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
         * @param _id
         * @param obj
         * @param callback
         * @returns {*|EmbeddedDocument}
         */
        function updateDashboardReference(dashboard, _id, obj, callback) {
            _id = _id.toString();

            for (var i=0; i<dashboard.widgets.length; i++) {
                if (dashboard.widgets[i]._id.toString() === _id) {
                    if (wasDataChanged(dashboard.widgets[i], obj)) {
                        dashboard.widgets.set(i, extend(dashboard.widgets[i], obj));
                        return dashboard.save(function(err, data) {
                            if (err) r.fail(res, err, 400);
                            else if (typeof callback === 'function') callback(data);
                        });
                    }
                }
            }
            if (typeof callback === 'function') callback();
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
     * Find widget by key inside the request
     * @param res
     * @param next
     * @param _id
     * @param callback (with the 'widget' argument)
     */
    function findWidget(res, next, _id, callback) {
        var query  = model.Widget.where({ _id: ObjectId(_id)});
        query.findOne(function (err, widget) {
            if (widget) {
                if (typeof callback === 'function') callback(widget);
            }
            else {
                if (err) r.fail(res, err);
                else r.fail(res, { message: "Widget not found" });

                return next();
            }
        });
    }

    /**
     * Find dashboard by name inside the request
     * @param res
     * @param next
     * @param _id
     * @param callback (with the 'dashboard' argument)
     */
    function findDashboard(res, next, _id, callback) {
        var query  = model.Dashboard.where({ _id: ObjectId(_id) });
        query.findOne(function (err, dashboard) {
            if (dashboard) {
                if (typeof callback === 'function') callback(dashboard);
            }
            else {
                if (err) r.fail(res, err);
                else r.fail(res, { message: "Dashboard not found" });

                return next();
            }
        });
    }

};