
var routes = ['static', 'test'];

module.exports = function(server) {
    routes.forEach(function(routeName) {
        require('./routing/' + routeName)(server);
    });
};