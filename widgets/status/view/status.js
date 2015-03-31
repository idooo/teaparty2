'use strict';

angular.module('teaparty2.widgets')
    .directive('widgetStatus', function(TemplatePath) {

    return {
        restrict: 'E',
        replace: true,
        require: '^widgetContainer',
        scope: {
            widget: '=widget'
        },
        templateUrl: TemplatePath.get('status'),
        link: function(scope, element, attrs, widgetContainer) {
            widgetContainer.hideCaption();
        },
        controller: function($scope, $element, $attrs, WidgetSubscriber)  {
            WidgetSubscriber.update($scope);
        }
    }
});
