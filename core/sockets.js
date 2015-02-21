var exportObj = {},
    socketsModules = [
        'widgets',
        'rotations'
    ];

module.exports = function(io, model, config) {

    if (process.env.nosync === "true") {
        config.logger.info("Updates via web sockets were disabled");
        return exportObj;
    }

    socketsModules.forEach(function(moduleName) {
        exportObj[moduleName] = require('./sockets/' + moduleName)(io, model, config);
    });

    return exportObj;
};