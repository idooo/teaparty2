'use strict';

angular.module('teaparty2.widgets')
    .directive('widgetStatus', function(TemplatePath) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            widget: '=widget'
        },
        templateUrl: TemplatePath.get('status'),
        controller: function($scope, $element, $attrs, WidgetSubscriber)  {
            WidgetSubscriber.update($scope);
        }
    }
});
