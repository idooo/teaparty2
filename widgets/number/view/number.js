'use strict';

angular.module('teaparty2.widgets')
    .directive('widgetNumber', function(TemplatePath) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            widget: '=widget'
        },
        templateUrl: TemplatePath.get('number'),
        controller: function($scope, $element, $attrs, WidgetSubscriber)  {
            WidgetSubscriber.update($scope);
        }
    }
});
