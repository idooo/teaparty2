var restify = require('restify'),
    socketio = require('socket.io');

try {
    var configName = __dirname + '/config/default.json';
    if (process.env.config) {
        configName = require('path').resolve(process.cwd(), process.env.config);
    }
    var config = require(configName);
}
catch (e) {
    console.error('Error! Cannot find config file "' + process.env.config + '"\nExisting now...');
    process.exit(1);
}

var logger = require('./core/logging')(config),
    server = restify.createServer(),
    io = socketio.listen(server.server),
    model = require('./core/database')(config),
    datasources = require('./core/datasources')(config, model);

server.use(restify.bodyParser());

// Load web sockets, update config object
require('./core/sockets')(io, model, config);

// Load all the widgets, update config object
require('./core/widget_loader')(config);

// Load routing
require('./core/routing')(server, model, config);

// Start server
server.listen(config.server.port, function () {
    logger.info('Teaparty2 server is listening at %s', server.url);
});