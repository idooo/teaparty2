var datasourceName = 'pull';

module.exports = function(config, model) {

    var query = model.Datasource.where({type: datasourceName});
    query.find(function (err, datasources) {
        if (datasources) {

        }
    });
};
