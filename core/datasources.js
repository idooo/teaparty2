module.exports = function(config, model) {

    // init datasourcesTypes config array and add PUSH datasource
    config.datasourcesTypes = ['PUSH'];

    var pull = require('./datasources/pull')(config, model);
};