(function () {

    'use strict';

    angular
        .module('teaparty2.widget')
        .directive('widgetContainer', widgetContainerDirective);

    function widgetContainerDirective() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                widget: '=',
                dashboardName: '@'
            },
            templateUrl: 'widget/widget_container/widget_container.template',
            link: link,
            controller: controller
        };
    }

    /**
     * Link function for widget container directive
     * @param scope
     */
    function link(scope) {
        scope.rendered = false;
        scope.$on('widgetReadyEvent', function () {
            scope.rendered = true;
        });
    }

    /**
     * Controller for widget container directive
     * @param $scope
     * @param $element
     * @param $attrs
     * @param ngDialog
     */
    function controller($scope, $element, $attrs, ngDialog) {
        $scope.openWidgetSettingsDialog = function () {
            ngDialog.open({
                template: 'views/modal/widget_settings.html',
                controller: 'WidgetSettingsController as ctrl',
                data: {
                    dashboardName: $scope.dashboardName,
                    widget: $scope.widget
                }
            });
        };
    }

})();
