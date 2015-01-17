'use strict';

// Project dependencies
var modules = [
    'ngResource',
    'ui.router',
    'ngDialog',
    'gridster',
    'LocalStorageModule',
    'btford.socket-io',

    'teaparty2.core',
    'teaparty2.template',
    'teaparty2.dashboard',
    'teaparty2.rotation',
    'teaparty2.widget',

    'teaparty2.widgets',
    'teaparty2.widgets.template'
];

// Init app and modules
angular.module('teaparty2', modules);

angular.module("teaparty2.core", []);
angular.module("teaparty2.dashboard", []);
angular.module("teaparty2.rotation", []);
angular.module("teaparty2.widget", []);
angular.module("teaparty2.template", []);

angular.module("teaparty2.widgets", []);
angular.module("teaparty2.widgets.template", []);

// Initial app config
angular
    .module('teaparty2')
    .config(function($stateProvider, $urlRouterProvider, gridsterConfig) {

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

    })
    .run(function($rootScope, $http, Settings, Auth) {
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

