var DATASOURCE_NAME = 'PULL';

module.exports = function(config, model) {

    config.datasourcesTypes.push(DATASOURCE_NAME);

    /*
    var query = model.Datasource.where({type: datasourceName});
    query.find(function (err, datasources) {
        if (datasources) {

        }
    });

    */
};
