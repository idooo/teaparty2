var restify = require('restify');

module.exports = function(server) {

    server.get(/^\/bower_components\/.*$/, restify.serveStatic({
        directory: './web'
    }));

    server.get(/^\/(.*\.(html|css|js|template|ttf|woff|svg|eot)){0,1}$/, restify.serveStatic({
       directory: './web/dist', default: 'index.html', maxAge: 1 // TODO: disable in production
    }));
};