(function () {

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
                dashboardId: '@'
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
    function controller($scope, $element, $attrs, ModalService) {
        $scope.openWidgetSettingsDialog = () => ModalService.newWidget({
            dashboardId: $scope.dashboardId,
            widget: $scope.widget
        });
    }

})();
