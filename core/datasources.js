module.exports = function(config, model) {

    // init datasources config object and add PUSH datasource
    config.datasources = {};
    config.datasources.types = ['PUSH'];

    // Load pull datasource
    var pull = require('./datasources/pull')(config, model);
    config.datasources.types.push(pull.name);
    config.datasources[pull.name] = pull;
};
