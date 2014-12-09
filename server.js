var restify = require('restify');

var server = restify.createServer();
server.use(restify.queryParser());

require('./core/routing')(server);

var updater = require('./core/updater');

var io = require('socket.io').listen(server.server);

io.sockets.on('connection', function (socket) {
    console.log('connect client');
    //socket.emit('news', { hello: 'world' });
    socket.on('event1', function (data) {
            console.log(data);
    });
});

server.listen(8080, function () {
    console.log('socket.io server listening at %s', server.url);
});