var config = require(process.env.conf || './config/default.json'),
    restify = require('restify'),
    socketio = require('socket.io');

var server = restify.createServer(),
    io = socketio.listen(server.server),
    model = require('./core/database')(config);

// Load all the widgets
config.widgets = require('./core/widget_loader');

server.use(restify.bodyParser());

require('./core/routing')(server, model, config);
require('./core/synchronizer')(io, model, config);

server.listen(config.server.port, function () {
    console.log('socket.io server listening at %s', server.url);
});