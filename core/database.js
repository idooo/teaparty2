var mongoose = require('mongoose');

var models = ['dashboard', 'widget'],
    model = {};

module.exports = function(config) {
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
        console.log('DB: connected');
    });

    models.forEach(function(modelName) {
        var tmp = require('./model/' + modelName)(mongoose);
        models[tmp.name] = tmp.model;
    });

    return models;
};