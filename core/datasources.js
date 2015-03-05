module.exports = function(config, model) {
    var pull = require('./datasources/pull')(config, model);
};