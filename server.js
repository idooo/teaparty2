var restify = require('restify');

var server = restify.createServer();

server.get(/^\/bower_components\/.*$/, restify.serveStatic({ directory: './web' }));
server.get(/^\/(.*\.(html|css|js)){0,1}$/, restify.serveStatic({ directory: './web/dist', default: 'index.html' }));

server.get('/hello', function create(req, res, next) {
   res.send(201, Math.random().toString(36).substr(3, 8));
   return next();
});

server.listen(8080);