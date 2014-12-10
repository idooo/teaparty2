
var routes = ['static', 'dashboards', 'widgets'];

module.exports = function(server, model) {
    routes.forEach(function(routeName) {
        require('./routing/' + routeName)(server, model);
    });
};