'use strict';

var mongoose = require('mongoose');

var models = ['dashboard', 'widget', 'rotation'];

module.exports = function(config) {

    config.database.isConnected = false;

    var options = {
        db: { native_parser: true },
        server: { poolSize: 5 },
        user: config.database.username,
        pass: config.database.password
    };
    mongoose.connect(config.database.uri + ':' + config.database.port + '/' + config.database.db, options);

    var connection = mongoose.connection;
    connection.on('error', console.error.bind(console, 'connection error:'));
    connection.once('open', function callback () {
        config.database.isConnected = true;
        console.log('DB: connected');
    });

    models.forEach(function(modelName) {
        var tmp = require('./model/' + modelName)(mongoose, config);
        models[tmp.name] = tmp.model;
    });

    return models;
};
