'use strict';

angular.module('app.directives')
    .directive('widgetContainer', function(TemplatePath) {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            widget: '='
        },
        templateUrl: TemplatePath.get('directive', 'widget_container'),
        link: function(scope, element) {

        },
        controller: function($scope, $element, $attrs)  {

        }
    }
});
