(function () {

    // Project third-party dependencies
    var modules = [
        'ngResource',
        'ui.router',
        'ngDialog',
        'gridster',
        'LocalStorageModule',
        'btford.socket-io',
        'ngClipboard',
        'ui.slider',
        'ngTouch'
    ];

    // Application modules list
    var appModules = [
        'teaparty2.core',
        'teaparty2.template',
        'teaparty2.control',
        'teaparty2.dashboard',
        'teaparty2.rotation',
        'teaparty2.widget',
        'teaparty2.datasource',
        'teaparty2.widgets',
        'teaparty2.widgets.template'
    ];

    // Init modules
    appModules.forEach((moduleName) => angular.module(moduleName, []));

    // Initial app config
    angular
        .module('teaparty2', modules.concat(appModules))
        .config(configuration)
        .run(init);

    /**
     * Teaparty2 ng app configuration
     * @param $stateProvider
     * @param $urlRouterProvider
     * @param $locationProvider
     * @param gridsterConfig
     * @param ngClipProvider
     */
    function configuration ($stateProvider, $urlRouterProvider, $locationProvider, gridsterConfig, ngClipProvider) {

        // Allow widget resize only using bottom right corner
        gridsterConfig.resizable.handles = ['se'];

        // Path to flash object used in copy to clipboard component
        ngClipProvider.setPath('/swf/ZeroClipboard.swf');

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/d/');

        $stateProvider
            .state('app', {
                url: '/d/:dashboard',
                views: {
                    content: {
                        templateUrl: '/core/views/dashboard.html',
                        controller: 'CentralController as central'
                    }
                }
            })
            .state('rotation', {
                url: '/rotation/:url',
                views: {
                    content: {
                        templateUrl: '/rotation/views/rotation.html',
                        controller: 'RotationController as rotation'
                    }
                }
            })
            .state('control', {
                url: '/control',
                views: {
                    content: {
                        templateUrl: '/control/views/control.html',
                        controller: 'ControlController as control'
                    }
                }
            });
    }

    /**
     * Teaparty2 ng app runtime config
     * @param $rootScope
     * @param Settings
     * @param Auth
     * @param Sockets
     */
    function init ($rootScope, Settings, Auth, Sockets) {

        // Check user tokens on application start, set headers if succeed
        Auth.updateAuthHeader();
        Settings.get().then(function (settings) {
            if (angular.isDefined(settings) && settings.auth === false) {
                $rootScope.isAuthorised = true;
                Auth.token = 0;
            }
            else {
                Auth.check(undefined, function (isAuthorised) {
                    $rootScope.isAuthorised = isAuthorised;
                });
            }
        });

        // Helper for inverse filtering
        $rootScope.not = function (func) {
            return function (item) {
                return !func(item);
            };
        };

        // Bluff for visibility
        Sockets.init();
    }

})();
