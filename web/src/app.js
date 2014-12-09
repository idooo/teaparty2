'use strict';

// Project dependencies
var modules = [
	'ngResource',
	'ui.router',
	'app.services',
	'app.templates',
	'app.widgets'
];

angular.module('teaparty2', modules);

angular.module("app.services", []);
angular.module("app.templates", []);

angular.module("app.widgets", [])

    // Helper for template path resolving for components
    .factory('TemplatePath', function() {
        return {
            get: function (path, component) {
                return "widgets/" + path + "/" + (component || path) + ".template";
            }
        }
    });


var app = angular.module('teaparty2').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

	$stateProvider
	.state('app', {
		url: '/',
		views: { 
			'content': { templateUrl: "/views/home.html", controller: 'MainCtrl as ctrl'  }
		}
	})
});


