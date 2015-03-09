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

        model.Rotation.getByUrl(req.params.url)
            .then(function(rotation) {
                config.sync.rotationControl({
                    type: 'pause',
                    _id: rotation._id
                });
                r.ok(res);
                return next();
            })
            .catch(function(err) {
                r.fail(res, err);
                return next();
            });
    });

     /**
     * POST: /api/control/rotation/:url/resume
     * Resume rotation
     *
     * AUTH: unauthorised users can't control rotations
     */
    server.post('/api/control/rotation/:url/resume', function(req, res, next) {

        auth.check(req, res, next, config);

        model.Rotation.getByUrl(req.params.url)
            .then(function(rotation) {
                config.sync.rotationControl({
                    type: 'resume',
                    _id: rotation._id
                });
                r.ok(res);
                return next();
            })
            .catch(function(err) {
                r.fail(res, err);
                return next();
            });
    });

    /**
     * POST: /api/control/rotation/:url/:dashboardId
     * Make :dashboardId dashboard active for rotation
     *
     * AUTH: unauthorised users can't control rotations
     */
    server.post('/api/control/rotation/:url/:dashboardId', function(req, res, next) {

        auth.check(req, res, next, config);

        var rotation;

        model.Rotation.getByUrl(req.params.url)
            .then(function(_rotation) {
                rotation = _rotation;
                return model.Dashboard.get(req.params.dashboardId);
            })
            .then(function() {
                var data = {
                    type: 'selectDashboard',
                    _id: rotation._id,
                    dashboardId: req.params.dashboardId
                };

                for (var i=0; i<rotation.dashboards.length; i++) {
                    if (rotation.dashboards[i]._id.toString() === req.params.dashboardId) {
                        config.sync.rotationControl(data);
                        r.ok(res);
                        return next();
                    }
                }

                r.fail(res, {message: "Dashboard not in the rotation"}, 400);
                return next();
            })
            .catch(function(err) {
                r.fail(res, err);
                return next();
            });

    });
};