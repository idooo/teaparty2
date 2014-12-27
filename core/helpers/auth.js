var r = require('./response');

module.exports = {

    isAuthorised: function(req, config) {
        var token;

        if (config.auth !== true) return true;
        if (typeof config.tokens === 'undefined') return false;

        token = req.header('authorization-token');
        if (typeof token === 'string') {
            return typeof config.tokens[token] !== 'undefined'
        }
        return false;
    },

    check: function(req, res, next, config) {
        if (!this.isAuthorised(req, config)) {
            r.fail(res, { message: "Not authorised" }, 401);
            next();
        }
    }
};