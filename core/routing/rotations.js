var mongoose = require('mongoose'),
    helpers = require('./../helpers'),
    r = helpers.response,
    auth = helpers.auth,
    ObjectId = require('mongoose').Types.ObjectId,
    extend = require('util')._extend;

module.exports = function(server, model, config) {

    /**
     * POST: /api/rotation
     * Create new rotation
     *
     * AUTH: not authorised users can't create rotations
     */
    server.post('/api/rotation', function(req, res, next) {

        auth.check(req, res, next, config);

        var rotation = new model.Rotation();
        rotation.save(function (err, data) {
            if (err) r.fail(res, err, 400);
            else r.ok(res, data);
            return next();
        });
    });

    /**
     * GET: /api/rotation/:url
     * Get the rotation by url
     */
    server.get('/api/rotation/:url', function(req, res, next) {

        function findRotationByUrl(url, callback, errorCallback) {
            var query = model.Rotation.where({url: url});
            query.findOne(function (err, rotation) {
                if (rotation && typeof callback === 'function') return callback(rotation);
                if (typeof errorCallback === 'function') errorCallback(err);
            });
        }

        function findDashboards(ids, callback) {
            var query = model.Dashboard.where({ _id: {$in: ids }});
            query.find(function (err, dashboards) {
                if (err) {
                    r.fail(res, err);
                    return next();
                }
                if (typeof callback !== 'undefined') callback(dashboards);
            })
        }

        var errorHandler = getErrorHandler(res, next);
        findRotationByUrl(req.params.url, function(rotation) {
            var _ids = [],
                timeouts = {};

            rotation.dashboards.forEach(function(dashboard) {
                _ids.push(dashboard._id);
                timeouts[dashboard._id.toString()] = dashboard.timeout;
            });

            findDashboards(_ids, function(rawDashboards) {
                var dashboards = [];
                rawDashboards.forEach(function(rawDashboard) {
                    var _dashboard = helpers.sanitize(rawDashboard, ['widgets']);
                    _dashboard.timeout = timeouts[rawDashboard._id.toString()];
                    dashboards.push(_dashboard);
                });
                rotation.dashboards = dashboards;
                r.ok(res, rotation);
                return next();
            });
        },
        errorHandler);
    });

    /**
     * PUT: /api/rotation/:rotationId
     * Change :rotationId settings
     *
     * AUTH: not authorised users can't modify rotations
     *
     * post params:
     *  - name (string)
     *  - url (any value -> url will be regenerated)
     */
    server.put('/api/rotation/:rotationId', function(req, res, next) {

        auth.check(req, res, next, config);

        var paramNames = ['name'],
            regenerateUrlName = 'url',
            updateObj = {};

        var query = model.Rotation.where({ _id: ObjectId(req.params.rotationId)});

        paramNames.forEach(function(paramName) {
            if (typeof req.params[paramName] !== 'undefined') {
                updateObj[paramName] = req.params[paramName];
            }
        });

        if (typeof req.params[regenerateUrlName] !== 'undefined') {
            updateObj[regenerateUrlName] = model.Rotation.getUrl()
        }

        query.findOneAndUpdate(updateObj, function (err, rotation) {
            if (rotation) r.ok(res, rotation);
            else {
                if (err) r.fail(res, err);
                else r.fail(res, { message: "Rotation not found" });
            }
            return next();
        });
    });

    /**
     * GET: /api/rotations
     * Get the rotations list
     *
     * AUTH: not authorised users can't get rotations list
     */
    server.get('/api/rotations', function(req, res, next) {

        auth.check(req, res, next, config);

        loadDashboards(function(formattedDashboards) {

            var query  = model.Rotation.where();
            query.find(function (err, rotations) {
                if (err) {
                    r.fail(res, err);
                    return next();
                }

                var formattedRotations = [];

                rotations.forEach(function(rotation) {
                    var dashboards = [];
                    rotation.dashboards.forEach(function(rawDashboard) {

                        var _strID = rawDashboard._id.toString();
                        if (formattedDashboards[_strID] !== 'undefined') {
                            var _dashboard = helpers.sanitize(formattedDashboards[_strID], ['widgets']);
                            _dashboard.timeout = rawDashboard.timeout;
                            dashboards.push(_dashboard);
                        }
                    });
                    rotation.dashboards = dashboards;
                    formattedRotations.push(helpers.sanitize(rotation));
                });

                r.ok(res, formattedRotations);
                return next();
            });
        });

        function loadDashboards(callback) {
            var query = model.Dashboard.where();
            query.find(function (err, dashboards) {
                if (err) {
                    r.fail(res, err);
                    return next();
                }

                var formattedDashboards = {};

                dashboards.forEach(function(dashboard) {
                    formattedDashboards[dashboard._id.toString()] = dashboard;
                });

                if (typeof callback !== 'undefined') callback(formattedDashboards);
            })
        }
    });

    /**
     * DELETE: /api/rotation/:rotationId
     * Delete the rotation by rotationId
     *
     * AUTH: not authorised users can't delete rotations
     */
    server.del('/api/rotation/:rotationId', function(req, res, next) {

        auth.check(req, res, next, config);

        var query  = model.Rotation.where({ _id: ObjectId(req.params.rotationId) });
        query.findOneAndRemove(function (err, rotation) {
            if (rotation) {
                r.ok(res);
                notify(rotation);
            }
            else {
                if (err) r.fail(res, err, 400);
                else r.fail(res);
            }

            return next();
        });
    });

    /**
     * POST: /api/rotation/:rotationId/:dashboardId
     * Add :dashboardID (ID) to the :rotationId rotation
     *
     * AUTH: not authorised users can't modify rotations
     */
    server.post('/api/rotation/:rotationId/:dashboardId', function(req, res, next) {

        auth.check(req, res, next, config);

        var errorHandler = getErrorHandler(res, next);

        findRotation(req, function(rotation) {

            findDashboard(req.params.dashboardId, function(dashboard) {
                for (var i=0; i<rotation.dashboards.length; i++) {
                    if (rotation.dashboards[i]._id.toString() === req.params.dashboardId) {
                        r.fail(res, {message: "Dashboard already in this rotation"}, 400);
                        return next();
                    }
                }

                rotation.dashboards.push({
                    _id: dashboard._id,
                    timeout: 30
                });

                rotation.save(function(err) {
                    if (err) return errorHandler(err);

                    r.ok(res);
                    notify(rotation);
                    return next();
                })
            },
            errorHandler);
        },
        errorHandler);

        function findDashboard(dashboardId, callback, errorCallback) {
            var query  = model.Dashboard.where({ _id: ObjectId(dashboardId) });
            query.findOne(function (err, dashboard) {
                if (dashboard && typeof callback === 'function') return callback(dashboard);
                if (typeof errorCallback === 'function') errorCallback(err);
            });
        }

    });

    /**
     * PUT: /api/rotation/:rotationId/:dashboardId
     * Change :dashboardId (ID) settings in the :url rotation
     *
     * AUTH: not authorised users can't modify rotations
     *
     * post params:
     *  - timeout
     */
    server.put('/api/rotation/:rotationId/:dashboardId', function(req, res, next) {

        auth.check(req, res, next, config);

        var errorHandler = getErrorHandler(res, next);

        findRotation(req, function(rotation) {
            var found = false;
            for (var i=0; i<rotation.dashboards.length; i++) {
                if (rotation.dashboards[i]._id.toString() === req.params.dashboardId) {
                    found = true;

                    // TODO: not safe?
                    rotation.dashboards.set(i, extend(rotation.dashboards[i], {
                        timeout: parseInt(req.params.timeout, 10)
                    }));

                    rotation.save(function(err) {
                        if (err) return errorHandler(err);

                        r.ok(res);
                        notify(rotation);
                        return next();
                    })
                }
            }

            if (!found) {
                r.fail(res, {message: "No dashboard with this id in rotation"}, 404);
                return next();
            }
        },
        errorHandler);
    });

    /**
     * DELETE: /api/rotation/:url/:dashboardId
     * Remove the :dashboardId (ID) from the :url rotation
     *
     * AUTH: not authorised users can't modify rotations
     */
    server.del('/api/rotation/:rotationId/:dashboardId', function(req, res, next) {

        auth.check(req, res, next, config);

        var errorHandler = getErrorHandler(res, next);

        findRotation(req, function(rotation) {
            var found = false;
            for (var i=0; i<rotation.dashboards.length; i++) {
                if (rotation.dashboards[i]._id.toString() === req.params.dashboardId) {
                    found = true;
                    rotation.dashboards.splice(i, 1);

                    rotation.save(function(err) {
                        if (err) return errorHandler(err);

                        r.ok(res);
                        notify(rotation);
                        return next();
                    })
                }
            }

            if (!found) {
                r.fail(res, {message: "No dashboard with this id in rotation"}, 404);
                return next();
            }
        },
        errorHandler);
    });

    /**
     * Use websockets to notify that rotation was changed
     * @param rotation
     */
    function notify(rotation) {
        try {
            config.sync.rotationWasChanged(rotation);
        }
        catch (e) {
            config.logger.warn('Rotation update: Web sockets notification failure');
        }
    }

    /**
     * Get rotation based on request rotationId
     * @param req
     * @param callback
     * @param errorCallback
     */
    function findRotation(req, callback, errorCallback) {
        var query  = model.Rotation.where({ _id: ObjectId(req.params.rotationId) });
        query.findOne(function (err, rotation) {
            if (rotation && typeof callback === 'function') return callback(rotation);
            if (typeof errorCallback === 'function') errorCallback(err);
        });
    }

    /**
     * Get error handler in context of request
     * @param res
     * @param next
     * @returns {Function}
     */
    function getErrorHandler(res, next) {
        return function(err) {
            if (err) r.fail(res, err, 400);
            else r.fail(res);
            return next();
        }
    }
};