
var routes = [
    'static',
    'settings',
    'dashboards',
    'dashboard_widgets',
    'widgets',
    'auth',
    'push',
    'rotations',
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
