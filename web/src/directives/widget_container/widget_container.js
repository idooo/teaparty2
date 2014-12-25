'use strict';

angular.module('app.directives')
    .directive('widgetContainer', function(TemplatePath) {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            widgetKey: '@',
            dashboardName: '@'
        },
        templateUrl: TemplatePath.get('directive', 'widget_container'),
        controller: function($scope, $element, $attrs, Widget)  {
            $scope.removeWidget = function() {
                console.log('remove widget', $scope.widgetKey);
                Widget.delete({dashboard: $scope.dashboardName, key: $scope.widgetKey}, function() {
                    $scope.deleted = true;
                });
            }
        }
    }
});
