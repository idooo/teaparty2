'use strict';

angular.module('app.widgets')
    .directive('widgetStatus', function(TemplatePath) {

    return {
        restrict: 'EA', // Suggest to use attribute if possible to provide compatibility with IE8
        replace: true,
        templateUrl: TemplatePath.get('status'),
        link: function(scope, element) {
            console.log('status link');
        },
        controller: function($scope, $element, $attrs)  {

        }
    }
});
