var r = require('./../helpers/response');

module.exports = function(server, model, config) {

    /**
     * GET /api/settings
     * Get settings object from server
     */
    server.get('/api/settings', function(req, res, next) {

        var safeConfig = {};

        safeConfig.auth = (typeof config.auth !== 'undefined') ? config.auth : true;
        safeConfig.isDatabaseConnected = config.database.isConnected;

        safeConfig.widgetTypes = Object.keys(config.widgets);
        safeConfig.datasourcesTypes = config.datasourcesTypes;

        r.ok(res, safeConfig);
        return next();
    });
};