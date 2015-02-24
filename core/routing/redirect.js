var restify = require('restify');

module.exports = function(server) {

    server.get(/^\/((d|rotation)\/.*|control)$/, function(req, res) {
        res.header('Location', '/#' + req.url);
        res.send(302);
    });

};