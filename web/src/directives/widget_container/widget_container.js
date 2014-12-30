'use strict';

angular.module('app.directives')
    .directive('widgetContainer', function(TemplatePath) {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            widget: '=',
            dashboardName: '@'
        },
        templateUrl: TemplatePath.get('directive', 'widget_container'),
        controller: function($scope, $element, $attrs, ngDialog)  {

            $scope.openWidgetSettingsDialog = function() {
                ngDialog.open({
                    template: 'views/modal/widget_settings.html',
                    controller: 'WidgetSettingsController as ctrl',
                    data: {
                        dashboardName: $scope.dashboardName,
                        widget: $scope.widget
                    }
                })
            }
        }
    }
});
