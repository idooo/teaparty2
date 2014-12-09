var restify = require('restify');

var server = restify.createServer();

server.use(restify.queryParser());

server.get(/^\/bower_components\/.*$/, restify.serveStatic({ directory: './web' }));
server.get(/^\/(.*\.(html|css|js|template)){0,1}$/, restify.serveStatic({
   directory: './web/dist', default: 'index.html', maxAge: 1 // TODO: disable in production
}));

server.get('/hello', function create(req, res, next) {

   console.log(req.params);

   res.send(201, Math.random().toString(36).substr(3, 8));
   return next();
});

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