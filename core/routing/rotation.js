var r = require('./../helpers/response');

module.exports = function(server, model) {

    /**
     * POST: /api/rotation
     * Create new rotation
     */
    server.post('/api/rotation', function(req, res, next) {
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
        var query  = model.Rotation.where({ url: req.params.url });
        query.findOne(function (err, rotation) {
            if (rotation) {
                r.ok(res, rotation);
                return next();
            }
            else {
                if (err) r.fail(res, err, 400);
                else r.fail(res);
                return next();
            }
        });
    });

    /**
     * DELETE: /api/rotation/:url
     * Delete the rotation by key/url
     */
    server.del('/api/rotation/:url', function(req, res, next) {
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
     * POST: /api/rotation/:url/:dashboard
     * Add :dashboard (name) to the :url rotation
     */
    server.post('/api/rotation/:url/:dashboard', function(req, res, next) {

    });

    /**
     * PUT: /api/rotation/:url/:dashboard
     * Change :dashboard (name) settings in the :url rotation
     */
    server.put('/api/rotation/:url/:dashboard', function(req, res, next) {

    });

    /**
     * DELETE: /api/rotation/:url/:dashboard
     * Remove the :dashboard (name) from the :url rotation
     */
    server.del('/api/rotation/:url/:dashboard', function(req, res, next) {

    });

};