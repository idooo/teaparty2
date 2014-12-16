
var routes = [
    'static',
    'dashboards',
    'widgets',
    'auth',
    'push',
    'rotation'
];

module.exports = function(server, model, config) {
    routes.forEach(function(routeName) {
        require('./routing/' + routeName)(server, model, config);
    });
};