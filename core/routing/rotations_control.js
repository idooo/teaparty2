var mongoose = require('mongoose'),
    helpers = require('./../helpers'),
    r = helpers.response,
    auth = helpers.auth,
    ObjectId = require('mongoose').Types.ObjectId;

module.exports = function(server, model, config) {

    /**
     * POST: /api/control/rotation/:url/pause
     * Pause rotation
     *
     * AUTH: unauthorised users can't control rotations
     */
    server.post('/api/control/rotation/:url/pause', function(req, res, next) {

        auth.check(req, res, next, config);

        var errorHandler = getErrorHandler(res, next);

        findRotation(req, function(rotation) {
            config.sync.rotationPause({rotationId: rotation._id});
            r.ok(res);
            return next();
        }, errorHandler)
    });

     /**
     * POST: /api/control/rotation/:url/resume
     * Resume rotation
     *
     * AUTH: unauthorised users can't control rotations
     */
    server.post('/api/control/rotation/:url/resume', function(req, res, next) {

        auth.check(req, res, next, config);

        var errorHandler = getErrorHandler(res, next);

        findRotation(req, function(rotation) {
            config.sync.rotationResume({rotationId: rotation._id});
            r.ok(res);
            return next();
        }, errorHandler)
    });

    /**
     * POST: /api/control/rotation/:url/:dashboardId
     * Make :dashboardId dashboard active for rotation
     *
     * AUTH: unauthorised users can't control rotations
     */
    server.post('/api/control/rotation/:url/:dashboardId', function(req, res, next) {

        auth.check(req, res, next, config);

        var errorHandler = getErrorHandler(res, next);

        findRotation(req, function(rotation) {

            findDashboard(req, function() {

                var data = {
                    rotationId: rotation._id,
                    dashboardId: req.params.dashboardId
                };

                for (var i=0; i<rotation.dashboards.length; i++) {
                    if (rotation.dashboards[i]._id.toString() === req.params.dashboardId) {
                        config.sync.rotationChangeDashboard(data);
                        r.ok(res);
                        return next();
                    }
                }

                r.fail(res, {message: "Dashboard not in the rotation"}, 400);
                return next();
            },
            errorHandler);

        }, errorHandler);

    });


    /**
     * Get rotation based on request url
     * @param req
     * @param callback
     * @param errorCallback
     */
    function findRotation(req, callback, errorCallback) {
        var query  = model.Rotation.where({ url: req.params.url });
        query.findOne(function (err, rotation) {
            if (rotation && typeof callback === 'function') return callback(rotation);
            if (typeof errorCallback === 'function') errorCallback(err);
        });
    }

    /**
     * Get dashboard based on request dashboardId
     * @param req
     * @param callback
     * @param errorCallback
     */
    function findDashboard(req, callback, errorCallback) {
        var query  = model.Dashboard.where({ _id: ObjectId(req.params.dashboardId) });
        query.findOne(function (err, dashboard) {
            if (dashboard && typeof callback === 'function') return callback(dashboard);
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
        return function (err) {
            if (err) r.fail(res, err, 400);
            else r.fail(res);
            return next();
        }
    }
};