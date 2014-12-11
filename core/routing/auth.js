var uuid = require('node-uuid'),
    r = require('./../helpers/response'),
    endpoint = '/auth',
    endpointCheck = '/auth/:token';

module.exports = function(server, model, config) {

    var adminUsername = config.admin.username,
        adminPassword = config.admin.password;

    config.tokens = {};

    server.post(endpoint, function(req, res, next) {

        var isCorrect = (req.params.username === adminUsername && req.params.password === adminPassword);

        if (!isCorrect) r.fail(res, {message: 'Wrong password'}, 403);
        else {
            var token = uuid.v1();
            config.tokens[token] = new Date();

            r.ok(res, {token: token});
        }

        return next();
    });

    server.get(endpointCheck, function(req, res, next) {
        if (typeof config.tokens[req.params.token] === 'undefined') r.fail(res, {message: 'Token not valid'}, 403);
        else r.ok(res);

        return next();
    });
};