var restify = require('restify');

module.exports = function(server) {

    server.get(/^\/bower_components\/.*$/, restify.serveStatic({
        directory: __dirname + '/../../web'
    }));

    server.get(/^\/(.*\.(html|css|js|png|template|ttf|woff|svg|eot|swf)){0,1}$/, restify.serveStatic({
        directory: __dirname + '/../../web/dist', default: 'index.html', maxAge: 1 // TODO: disable in production
    }));
};