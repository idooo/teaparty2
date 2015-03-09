
var routes = [
    'static',
    'settings',
    'datasources',
    'dashboards',
    'dashboard_widgets',
    'widgets',
    'auth',
    'push',
    'rotations',
    'rotations_control',
    'redirect'
];

module.exports = function(server, model, config) {

    server.use(function (req, res, next) {
        if (req.url.indexOf('/api') >= 0) config.logger.debug(req.method + ' ' + req.url);
        return next();
    });

    routes.forEach(function(routeName) {
        require(__dirname + '/routing/' + routeName)(server, model, config);
    });
};
