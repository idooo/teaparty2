
module.exports = function(server) {

    server.get('/hello', function create(req, res, next) {

       console.log(req.params);

       res.send(201, Math.random().toString(36).substr(3, 8));
       return next();
    });
};