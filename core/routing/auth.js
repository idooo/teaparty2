var uuid = require('node-uuid'),
    r = require('./../helpers/response');

module.exports = function(server, model, config) {

    var noAuth = config.auth !== true,
        adminUsername = config.admin && config.admin.username,
        adminPassword = config.admin && config.admin.password;

    config.tokens = {};

    /**
     * POST: /api/auth
     * Auth admin user by login and password
     *
     * post body:
     *  - username
     *  - password
     */
    server.post('/api/auth', function(req, res, next) {

        if (noAuth) {
            r.ok(res, {token: 0});
            return next();
        }

        var isCorrect = (req.params.username === adminUsername && req.params.password === adminPassword);

        if (!isCorrect) r.fail(res, {message: 'Invalid username or password'}, 400);
        else {
            var token = uuid.v1();
            config.tokens[token] = new Date();

            r.ok(res, {token: token});
        }

        return next();
    });

    /**
     * GET /api/auth/:token
     * Check if :token is authorised and valid
     */
    server.get('/api/auth/:token', function(req, res, next) {

        if (noAuth) {
            r.ok(res);
        }
        else {
            if (typeof config.tokens[req.params.token] === 'undefined') {
                r.fail(res, {message: 'Token not valid'}, 400);
            }
            else r.ok(res);
        }

        return next();
    });
};