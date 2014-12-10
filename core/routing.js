
var routes = ['static', 'dashboards'];

module.exports = function(server, model) {
    routes.forEach(function(routeName) {
        require('./routing/' + routeName)(server, model);
    });
};