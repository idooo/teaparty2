'use strict';

angular.module('app.widgets')
    .directive('widgetStatus', function(TemplatePath) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            widget: '=widget'
        },
        templateUrl: TemplatePath.get('widget', 'status'),
        link: function(scope, element) {

        },
        controller: function($scope, $element, $attrs)  {

        }
    }
});
