'use strict';

// Project dependencies
var modules = [
	'ngResource',
	'ui.router',
	'ngDialog',
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
			return (type === "widget" ? "widgets" : "directives") +
				"/" + path + "/" + (component || path) + ".template";
		}
	}
});

// Initial app config
angular.module('teaparty2').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

	$stateProvider
		.state('app', {
			url: '/:dashboard',
			views: {
				'content': {
					templateUrl: "/views/layout.html",
					controller: 'CentralController as central'
				}
			}
		})
});


