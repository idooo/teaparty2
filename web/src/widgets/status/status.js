'use strict';

angular.module('app.widgets')
    .directive('widgetStatus', function(TemplatePath) {

    return {
        restrict: 'EA', // Suggest to use attribute if possible to provide compatibility with IE8
        replace: true,
        scope: {
            data: '='
        },
        templateUrl: TemplatePath.get('widget', 'status'),
        link: function(scope, element) {
            
        },
        controller: function($scope, $element, $attrs)  {

        }
    }
});
