var winston = require('winston'),
    fs = require('fs'),
    restify = require('restify'),
    socketio = require('socket.io'),
    r = require('../core/helpers/response');

var server = restify.createServer(),
    io = socketio.listen(server.server),
    config = require('../config/default.json'),
    model = {},
    dataMocks = {};

server.use(restify.bodyParser());
server.use(function (req, res, next) {
    if (typeof dataMocks[req.url] !== 'undefined') {
        logger.info(req.url + ' [mocked response]');
        r.ok(res, dataMocks[req.url]);
    }
    else if (!req.url.match(/\.(js|html|template|swf|woff|css)(\?\d+)*$/)) {
        logger.warn(req.url + ' - no mocked data');
    }
    return next();
});

// Logger
config.logger = logger = new (winston.Logger) ({
    transports: [
        new (winston.transports.Console)({
            level: (config.logs || {}).level,
            colorize: true
        })
    ]
});

// Routing
require('../core/routing.js')(server, model, config);

// Load routes mocks
var dataMocksDir = __dirname + '/mocks';
var dataMocksFiles = fs.readdirSync(dataMocksDir);
dataMocksFiles.forEach(function(fileName) {
    var raw = require(dataMocksDir + '/' + fileName);
    raw.mocks.forEach(function(item) {
        dataMocks[item.url] = item.data;
    })
});

// Start mocked server
server.listen(process.env.port || 8080, function () {
    logger.info('Teaparty2 MOCKED server is listening at %s', server.url);
});