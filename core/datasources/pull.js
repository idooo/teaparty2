var Promise = require('promise'),
    request = require('request'),
    ObjectId = require('mongoose').Types.ObjectId,
    DATASOURCE_NAME = 'PULL',
    DISABLE_FLAG = 'nopull';

module.exports = function(config, model) {

    // List of registered datasources
    var datasourcesList = [];

    // object to export, public API
    var object = { name: DATASOURCE_NAME };

    object.registerDatasource = function(datasource) {
        if (process.env[DISABLE_FLAG] === "true") {
            return config.logger.warn('registerDatasource error:', DATASOURCE_NAME, 'was disabled');
        }
        config.logger.debug('Registering new datasource', datasource._id.toString(), '...');
        var obj = addDatasourceToList(datasource);
        createTimer(obj);
    };

    object.deregisterDatasource = function(datasource) {
        if (process.env[DISABLE_FLAG] === "true") {
            return config.logger.warn('deregisterDatasource error:', DATASOURCE_NAME, 'was disabled');
        }
        for (var i=0; i<datasourcesList.length; i++) {
            if (datasourcesList[i].datasource._id.toString() === datasource._id.toString()) {
                config.logger.debug('Deregistering datasource', datasource._id.toString(), '...');
                removeTimer(datasourcesList[i]);
                datasourcesList.splice(i, 1);
            }
        }
    };

    if (process.env[DISABLE_FLAG] === "true") {
        config.logger.warn(DATASOURCE_NAME, "datasource was disabled");
    }
    else {
        // Get datasources from DB and register them
        getDatasources().then(function () {
            config.logger.debug('Registering ' + datasourcesList.length + ' ' + DATASOURCE_NAME + ' datasources...');
            datasourcesList.forEach(function (obj) {
                createTimer(obj);
            })
        });
    }

    return object;

    /**
     * Get list of datasources by type from the DB and add them to list to register
     * @returns {Promise}
     */
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
                        addDatasourceToList(datasource);
                    });
                }
                resolve(datasources);
            });
        });
    }

    /**
     * Add datasources to the list
     * @param datasource
     * @returns {{datasource: *, timer: undefined}}
     */
    function addDatasourceToList(datasource) {
        var obj = {
            datasource: datasource,
            timer: undefined
        };
        datasourcesList.push(obj);
        return obj;
    }

    /**
     * Create timer with updating function there
     * @param obj
     */
    function createTimer(obj) {
        if (typeof obj.timer === 'undefined') {
            obj.timer = setInterval(getUpdatingFunction(obj.datasource), obj.datasource.interval * 1000)
        }
    }

    /**
     * Remove timer from datasource object
     * @param obj
     */
    function removeTimer(obj) {
        if (typeof obj.timer !== 'undefined') {
            clearInterval(obj.timer);
            obj.timer = undefined;
        }
    }

    /**
     * Create updating function for datasource
     * @param datasource
     * @returns {Function}
     */
    function getUpdatingFunction(datasource) {
        return function() {
            config.logger.debug(['Datasource', datasource._id, 'is requesting', datasource.url, '...'].join(' '));
            request(datasource.url, function (error, response, body) {
                var success = !error && response.statusCode == 200;
                if (success) {
                    config.logger.debug(['Datasource', datasource._id, 'pulled content length', body.length].join(' '));
                    datasource.raw_data = body;
                    datasource.last_update_status = 'success';
                }
                else {
                    datasource.last_update_status = 'fail';
                    datasource.last_error = error;
                }
                datasource.last_update_date = new Date();
                updateDatabaseData(datasource, success);
            })
        }
    }

    /**
     * Update datasource date in the DB
     * @param datasource
     * @param {boolean} success
     */
    function updateDatabaseData(datasource, success) {
        var query = model.Datasource.where({ _id: ObjectId(datasource._id)}),
            updateObj = {
                last_update_date: datasource.last_update_date,
                last_update_status: datasource.last_update_status
            };

        if (success) updateObj.raw_data = datasource.raw_data;
        else updateObj.last_error = datasource.last_error;

        query.findOneAndUpdate(updateObj, function (err, obj) {
            if (err || obj === null) config.logger.warn('Cannot update datasource', datasource._id, 'in database');
        });
    }
};
