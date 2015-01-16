'use strict';

angular.module('app.widgets')
    .directive('widgetText', function(TemplatePath) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            widget: '=widget'
        },
        templateUrl: TemplatePath.get('widget', 'text'),
        controller: function($scope, $element, $attrs, $timeout, WidgetSubscriber, WidgetHelper)  {

            $scope.textElement = Sizzle('.widget-status__caption-inner > span', $element[0])[0];

            WidgetSubscriber.update($scope);

            WidgetSubscriber.sizeChange($scope, function(width, height) {
                WidgetHelper.textFill($scope.textElement, width, height);
            });

            // TODO: do something beautiful here
            $timeout(function() {
                WidgetHelper.textFill($scope.textElement, $element[0].offsetWidth, $element[0].offsetHeight);
            }, 1000)

        }
    }
});
