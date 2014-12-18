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
	'app.widgets',
	'app.directives'
];

// Init app and modules
angular.module('teaparty2', modules);
angular.module("app.services", []);
angular.module("app.templates", []);
angular.module("app.directives", []);
angular.module("app.widgets", []);

// Helper for template path resolving for components
angular.module("app.widgets").factory('TemplatePath', function() {
	return {
		get: function (type, path, component) {
			if (type === 'widget') return "widgets/" + path + "/view/" + (component || path) + ".template";
			else return "directives/" + path + "/" + (component || path) + ".template";
		}
	}
});

// Initial app config
angular.module('teaparty2').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/d/');

	$stateProvider
		.state('app', {
			url: '/d/:dashboard',
			views: {
				'content': {
					templateUrl: "/views/layout.html",
					controller: 'CentralController as central'
				}
			}
		})
		.state('rotation', {
			url: '/rotation/:url',
			views: {
				'content': {
					templateUrl: "/views/rotation.html",
					controller: 'RotationController as rotation'
				}
			}
		})
});


