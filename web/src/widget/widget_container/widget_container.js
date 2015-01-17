'use strict';

angular
    .module('teaparty2.widget')
    .directive('widgetContainer', function() {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            widget: '=',
            dashboardName: '@'
        },
        templateUrl: 'widget/widget_container/widget_container.template',
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
