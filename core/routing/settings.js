var uuid = require('node-uuid'),
    r = require('./../helpers/response');

module.exports = function(server, model, config) {

    /**
     * GET /api/settings
     * Get settings object from server
     */
    server.get('/api/settings', function(req, res, next) {

        var safeConfig = {};

        safeConfig.auth = (typeof config.auth !== 'undefined') ? config.auth : true;
        safeConfig.widgetTypes = Object.keys(config.widgets);

        r.ok(res, safeConfig);
        return next();
    });
};