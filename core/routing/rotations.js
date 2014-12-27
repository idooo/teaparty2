var mongoose = require('mongoose'),
    helpers = require('./../helpers'),
    r = helpers.response,
    auth = helpers.auth,
    extend = require('util')._extend;

module.exports = function(server, model, config) {

    function findRotation(url, callback, errorCallback) {
        var query  = model.Rotation.where({ url: url });
        query.findOne(function (err, rotation) {
            if (rotation && typeof callback === 'function') return callback(rotation);
            if (typeof errorCallback === 'function') errorCallback(err);
        });
    }

    function getErrorHandler(res, next) {
        return function(err) {
            if (err) r.fail(res, err, 400);
            else r.fail(res);
            return next();
        }
    }

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
     * Get the rotation by key/url
     */
    server.get('/api/rotation/:url', function(req, res, next) {

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
        findRotation(req.params.url,
            function(rotation) {
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
     * DELETE: /api/rotation/:url
     * Delete the rotation by key/url
     *
     * AUTH: not authorised users can't delete rotations
     */
    server.del('/api/rotation/:url', function(req, res, next) {

        auth.check(req, res, next, config);

        var query  = model.Rotation.where({ url: req.params.url });
        query.findOneAndRemove(function (err, rotation) {
            if (rotation) r.ok(res);
            else {
                if (err) r.fail(res, err, 400);
                else r.fail(res);
            }

            return next();
        });
    });

    /**
     * POST: /api/rotation/:url/:dashboardID
     * Add :dashboardID (ID) to the :url rotation
     *
     * AUTH: not authorised users can't modify rotations
     */
    server.post('/api/rotation/:url/:dashboardID', function(req, res, next) {

        auth.check(req, res, next, config);

        var errorHandler = getErrorHandler(res, next);

        findRotation(req.params.url,

            function(rotation) {

                findDashboard(req.params.dashboardID,

                    function(dashboard) {

                        for (var i=0; i<rotation.dashboards.length; i++) {
                            if (rotation.dashboards[i]._id.toString() === req.params.dashboardID) {
                                r.fail(res, {message: "Dashboard already in this rotation"}, 400);
                                return next();
                            }
                        }

                        rotation.dashboards.push({
                            _id: dashboard._id,
                            timeout: 30
                        });

                        rotation.save(function(err) {
                            if (!err) {
                                r.ok(res);
                                return next();
                            }
                            errorHandler(err);
                        })
                    },
                    errorHandler);
            },
            errorHandler);

        function findDashboard(dashboardID, callback, errorCallback) {
            var query  = model.Dashboard.where({ _id: mongoose.Types.ObjectId(dashboardID) });
            query.findOne(function (err, dashboard) {
                if (dashboard && typeof callback === 'function') return callback(dashboard);
                if (typeof errorCallback === 'function') errorCallback(err);
            });
        }

    });

    /**
     * PUT: /api/rotation/:url/:dashboardID
     * Change :dashboardID (ID) settings in the :url rotation
     *
     * AUTH: not authorised users can't modify rotations
     *
     * post params:
     *  - timeout
     */
    server.put('/api/rotation/:url/:dashboardID', function(req, res, next) {

        auth.check(req, res, next, config);

        var errorHandler = getErrorHandler(res, next);

        findRotation(req.params.url,

            function(rotation) {
                var found = false;
                for (var i=0; i<rotation.dashboards.length; i++) {
                    if (rotation.dashboards[i]._id.toString() === req.params.dashboardID) {
                        found = true;

                        // TODO: not safe?
                        rotation.dashboards.set(i, extend(rotation.dashboards[i], {
                            timeout: parseInt(req.params.timeout, 10)
                        }));

                        rotation.save(function(err) {
                            if (err) return errorHandler(err);
                            r.ok(res);
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
     * DELETE: /api/rotation/:url/:dashboardID
     * Remove the :dashboardID (ID) from the :url rotation
     *
     * AUTH: not authorised users can't modify rotations
     */
    server.del('/api/rotation/:url/:dashboardID', function(req, res, next) {

        auth.check(req, res, next, config);

        var errorHandler = getErrorHandler(res, next);

        findRotation(req.params.url,

            function(rotation) {
                var found = false;
                for (var i=0; i<rotation.dashboards.length; i++) {
                    if (rotation.dashboards[i]._id.toString() === req.params.dashboardID) {
                        found = true;
                        rotation.dashboards.splice(i, 1);

                        rotation.save(function(err) {
                            if (err) return errorHandler(err);
                            r.ok(res);
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
};