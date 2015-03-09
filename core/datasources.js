module.exports = function(config, model) {
    config.datasourcesTypes = [];

    var pull = require('./datasources/pull')(config, model);
};