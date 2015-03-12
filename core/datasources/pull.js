var Promise = require('promise'),
    request = require('request'),
    ObjectId = require('mongoose').Types.ObjectId,
    DATASOURCE_NAME = 'PULL';

module.exports = function(config, model) {

    // TODO: Update list if datasource was added or removed, or data was changed

    config.datasourcesTypes.push(DATASOURCE_NAME);

    if (process.env.nopull === "true") {
        return config.logger.warn("Pull datasource was disabled");
    }

    var datasourcesList = [];

    getDatasources().then(function() {
        datasourcesList.forEach(function(datasource) {
            createTimer(datasource);
        })
    });

    function getDatasources() {
        return new Promise(function (resolve, reject) {
            var query = model.Datasource.where({type: DATASOURCE_NAME});
            query.find(function (err, datasources) {
                if (err) {
                    config.logger.warn('Get list of datasources [' + DATASOURCE_NAME + '] was failed');
                    reject(err);
                }

                // First start
                if (datasourcesList.length === 0) {
                    datasources.forEach(function(datasource) {
                        datasourcesList.push({
                            datasource: datasource,
                            timer: undefined
                        })
                    });
                }
                resolve(datasources);
            });
        });
    }

    function createTimer(obj) {
        if (typeof obj.timer === 'undefined') {
            obj.timer = setInterval(getUpdatingFunction(obj.datasource), obj.datasource.interval * 1000)
        }
    }

    function getUpdatingFunction(datasource) {
        return function() {
            config.logger.debug(['Datasource', datasource._id, 'is requesting', datasource.url, '...'].join(' '));
            request(datasource.url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    config.logger.debug(['Datasource', datasource._id, 'pulled content:'].join(' '), body);
                    datasource.raw_data = body;
                    datasource.last_update_status = 'success';
                    datasource.last_update_date = new Date();
                }
                updateDatabaseData(datasource);
            })
        }
    }

    function updateDatabaseData(datasource) {
        var query = model.Datasource.where({ _id: ObjectId(datasource._id)}),
            updateObj = {
                raw_data: datasource.raw_data,
                last_update_date: datasource.last_update_date,
                last_update_status: datasource.last_update_status
            };

        query.findOneAndUpdate(updateObj, function (err) {
            if (err) config.logger.warn('Cannot update datasource ', datasource._id, ' in database');
        });
    }
};
