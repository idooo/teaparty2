'use strict';

angular.module('teaparty2.widgets')
    .directive('widgetList', function(TemplatePath) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            widget: '=widget'
        },
        templateUrl: TemplatePath.get('list'),
        controller: function($scope, $element, $attrs, WidgetSubscriber)  {
            WidgetSubscriber.update($scope);
        }
    }
});
