var r = require('./../helpers/response'),
    extend = require('util')._extend;

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
            // TODO: find the better way to generate initial position
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
                if (dashboard.widgets[i]._id.toString() === _id) {
                    dashboard.widgets.splice(i, 1);
                }
            }

            dashboard.save(function(err) {
                if (err) r.fail(res, err, 400);
                else if (typeof callback === 'function') callback();
            });
        }

        findWidget(res, next, req.params.key, function(widget) {

            findDashboard(res, next, req.params.dashboard, function(dashboard) {

                deleteDashboardReference(dashboard, widget._id, function() {

                    widget.remove(function(err){
                        if (err) r.fail(res, err, 400);
                        else r.ok(res);

                        return next();
                    });
                });
            });
        });
    });

    /**
     * PUT: /api/dashboard/:dashboard/widget/:key
     * Update widget meta-data (not the data content) by :key
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
    server.put('/api/dashboard/:dashboard/widget/:key', function(req, res, next) {

        function updateDashboardReference(dashboard, _id, obj, callback) {
            _id = _id.toString();

            for (var i=0; i<dashboard.widgets.length; i++) {
                if (dashboard.widgets[i]._id.toString() === _id) {
                    dashboard.widgets.set(i, extend(dashboard.widgets[i], obj));
                }
            }
            dashboard.save(function(err, data) {
                if (err) r.fail(res, err, 400);
                else if (typeof callback === 'function') callback(data);
            });
        }

        function validateData(rawData) {
            var isPostion = false,
                isSize = false,
                data = {};

            // TODO: parseint for values
            if (Object.prototype.toString.call(rawData.position) === "[object Array]" && rawData.position.length >= 2 ) {
                isPostion = true;
                data.position = rawData.position.slice(0,2);
            }

            if (typeof rawData.size !== 'undefined' && typeof rawData.size.x !== 'undefined'
                && typeof rawData.size.y !== 'undefined') {
                isSize = true;
                data.size = {
                    x: rawData.size.x,
                    y: rawData.size.y
                }
            }
            if (!(isSize || isPostion)) throw "ValidationError";

            return data;
        }

        findWidget(res, next, req.params.key, function(widget) {

            findDashboard(res, next, req.params.dashboard, function(dashboard) {

                try {
                    var obj = validateData(JSON.parse(req.body.toString()));
                }
                catch (e) {
                    r.fail(res, {message: "Configuration object is not valid"}, 400);
                    return next();
                }

                updateDashboardReference(dashboard, widget._id, obj, function(data) {
                    r.ok(res);
                    return next();
                });
            });
        });
    });

    /**
     * Find widget by key inside the request
     * @param res
     * @param next
     * @param key
     * @param callback (with the 'widget' argument)
     */
    function findWidget(res, next, key, callback) {
        var query  = model.Widget.where({ key: key });
        query.findOne(function (err, widget) {
            if (widget) {
                if (typeof callback === 'function') callback(widget);
            }
            else {
                if (err) r.fail(res, err, 400);
                else r.fail(res);

                return next();
            }
        });
    }

    /**
     * Find dashboard by name inside the request
     * @param res
     * @param next
     * @param name
     * @param callback (with the 'dashboard' argument)
     */
    function findDashboard(res, next, name, callback) {
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

};