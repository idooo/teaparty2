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

server.listen(8080);