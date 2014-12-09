'use strict';

// Project dependencies
var modules = [
	'ngResource',
	'ui.router'
];

angular.module('teaparty2', modules);

angular.module("app.services", []);
angular.module("app.templates", []);

angular.module("app.components", [])

    // Helper for template path resolving for components
    .factory('TemplatePath', function() {
        return {
            get: function (path, component) {
                return "components/" + path + "/" + (component || path) + ".template";
            }
        }
    });


var app = angular.module('teaparty2').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

	$stateProvider
	.state('app', {
		url: '/',
		views: { 
			'content': { templateUrl: "views/pages/home.html", controller: 'HomeCtrl'  }
		}
	})
});


