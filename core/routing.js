
var routes = [
    'static',
    'settings',
    'dashboards',
    'widgets',
    'auth',
    'push',
    'rotations',
    'redirect'
];

module.exports = function(server, model, config) {
    routes.forEach(function(routeName) {
        require('./routing/' + routeName)(server, model, config);
    });
};