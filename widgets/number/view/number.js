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
        link: function(scope, element) {
            scope.textElement = Sizzle('.widget-number__data > span', element[0])[0];
        },
        controller: function($scope, $element, $attrs, WidgetSubscriber, WidgetHelper)  {
            WidgetSubscriber.update($scope);

            WidgetSubscriber.sizeChange($scope, function(width, height) {
                WidgetHelper.textFill($scope.textElement, width, height);
            });

            WidgetSubscriber.ready($scope, function() {
                WidgetHelper.textFill($scope.textElement, $element[0].offsetWidth, $element[0].offsetHeight);
            });
        }
    }
});
