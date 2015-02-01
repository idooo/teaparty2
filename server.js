try {
    var config = require(process.env.config || __dirname + '/config/default.json');
}
catch (e) {
    console.error('Error! Cannot find config file "' + process.env.config + '"\nExisting now...');
    process.exit(1);
}
var winston = require('winston'),
    restify = require('restify'),
    socketio = require('socket.io');

config.logger = logger = new (winston.Logger) ({
    transports: [
        new (winston.transports.Console)({
            level: (config.logs || {}).level,
            colorize: true
        }),
        new (winston.transports.File)({
            level: (config.logs || {}).level,
            json: false,
            filename: (config.logs || {}).file || __dirname + '/logs/teaparty2.log'
        })
    ]
});

var server = restify.createServer(),
    io = socketio.listen(server.server),
    model = require('./core/database')(config);

// Load all the widgets
config.widgets = require('./core/widget_loader')(config);

server.use(restify.bodyParser());

require('./core/routing')(server, model, config);

if (process.env.nosync !== "true") {
    logger.info("Updates via web sockets were disabled");
    require('./core/synchronizer')(io, model, config);
}

server.listen(config.server.port, function () {
    logger.info('Teaparty2 server is listening at %s', server.url);
});