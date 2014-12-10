
var endpoint = '/dashboard';

module.exports = function(server, model) {

    server.get(endpoint, function create(req, res, next) {

       console.log(req.params);

       res.send(201, Math.random().toString(36).substr(3, 8));
       return next();
    });

    server.post(endpoint, function(req, res, next) {

        var silence = new model.Dashboard({name: req.params.name});

        silence.save(function (err, data) {
            if (err) return console.error(err);
            console.log(data)
        });

        var response = {
            status: 'ok'
        };

        res.send(200, response);
        return next();
    })
};