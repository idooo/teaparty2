(function () {

    const RESIZE_SCALE_DELAY = 1000;

    angular
        .module('teaparty2.widget')
        .directive('widgetContainer', widgetContainerDirective);

    function widgetContainerDirective ($timeout) {

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

        /**
         * Link function for widget container directive
         * @param scope
         * @param element
         */
        function link (scope, element) {
            var children,
                widgetBody,
                widgetContentContainer,
                scalableElement;

            scope.rendered = false;

            scope.$on('widgetReadyEvent', function () {
                scope.rendered = true;

                children = element.children();
                widgetBody = children[children.length - 1];
                widgetContentContainer = widgetBody.firstElementChild;

                scalableElement = Sizzle('[data-scalable="true"]', element[0])[0];

                recalculateHeight();
            });

            scope.$on('widgetSizeChangeEvent:' + scope.widget._id, function () {
                $timeout(() => recalculateHeight(), RESIZE_SCALE_DELAY);
            });

            scope.$on('widgetUpdateEvent:' + scope.widget._id, function () {
                rescaleWidget(100);
            });

            function recalculateHeight () {
                widgetContentContainer.style.height = widgetBody.offsetHeight + 'px';
                rescaleWidget();
            }

            function rescaleWidget (timeout) {
                if (angular.isUndefined(scalableElement)) return;

                scalableElement.style.transform = 'scale(1)';

                // We need to add this delay because browsers do not calculate
                // height/width after transform instantly
                //
                // This is manipulation with DOM properties outside of Angular
                // so we do not need specialised $timeout here
                setTimeout(function () {
                    if (scalableElement.offsetHeight > widgetBody.offsetHeight) {
                        var scaleRatio = widgetBody.offsetHeight / scalableElement.offsetHeight;
                        scalableElement.style.transform = `scale(${scaleRatio})`;
                    }
                }, timeout);
            }
        }

        /**
         * Controller for widget container directive
         * @param $scope
         * @param $element
         * @param $attrs
         * @param ModalService
         */
        function controller ($scope, $element, $attrs, ModalService) {
            $scope.openWidgetSettingsDialog = () => ModalService.widgetSettings({
                dashboardId: $scope.dashboardId,
                widget: $scope.widget
            });

            this.hideCaption = function () {
                $scope.hideCaption = true;
            };
        }
    }

})();
