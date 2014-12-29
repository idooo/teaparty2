'use strict';

// Project dependencies
var modules = [
    'ngResource',
    'ui.router',
    'ngDialog',
    'gridster',
    'LocalStorageModule',
    'btford.socket-io',
    'app.services',
    'app.templates',
    'app.directives',
    'app.widgets',
    'app.widgets.templates'
];

// Init app and modules
angular.module('teaparty2', modules);
angular.module("app.services", []);
angular.module("app.templates", []);
angular.module("app.directives", []);
angular.module("app.widgets", []);
angular.module("app.widgets.templates", []);

// Helper for templates resolving for components and widgets
angular.module("app.widgets").factory('TemplatePath', function () {
    return {
        get: function (type, path, component) {
            if (type === 'widget') return "widgets/" + path + "/view/" + (component || path) + ".template";
            else return "directives/" + path + "/" + (component || path) + ".template";
        }
    }
});

// Initial app config
angular.module('teaparty2').config(function($stateProvider, $urlRouterProvider, gridsterConfig) {

    gridsterConfig.resizable.handles = ['se'];

    $urlRouterProvider.otherwise('/d/');

    $stateProvider
        .state('app', {
            url: '/d/:dashboard',
            views: {
                content: {
                    templateUrl: "/views/layout.html",
                    controller: 'CentralController as central'
                }
            }
        })
        .state('rotation', {
            url: '/rotation/:url',
            views: {
                content: {
                    templateUrl: "/views/rotation.html",
                    controller: 'RotationController as rotation'
                }
            }
        });

});

angular.module('teaparty2').run(function($rootScope, $http, Settings, Auth) {

    // Initial auth
    Auth.updateAuthHeader();
    Settings.get(function(settings) {
        if (typeof settings !== 'undefined' && settings.auth === false) {
            $rootScope.isAuthorised = true;
            Auth.token = 0;
        }
        else {
            Auth.check(undefined, function (isAuthorised) {
                $rootScope.isAuthorised = isAuthorised;
            });
        }
    });
});

