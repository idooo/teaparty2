(function () {

    angular
        .module('teaparty2.dashboard')
        .directive('dashboard', dashboardDirective);

    function dashboardDirective() {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                widgets: '=',
                selectedDashboard: '=src',
                options: '=?'
            },
            templateUrl: 'dashboard/dashboard/dashboard.template',
            link: link,
            controller: controller
        };
    }

    /**
     * Link function for dashboard directive
     * @param scope
     */
    function link(scope) {
        scope.state = 'locked';

        scope.$watch('selectedDashboard', function (newDashboard) {
            if (is.undefined(newDashboard)) return;
            scope.renderDashboard();
        });

        scope.$watch('options', function () {
            scope.updateOptions();
        }, true);
    }

    /**
     * Controller function for dashboard directive
     * @param $scope
     * @param $element
     * @param $attrs
     * @param $compile
     * @param $timeout
     * @param DashboardWidgetService
     */
    function controller($scope, $element, $attrs, $compile, $timeout, DashboardWidgetService) {

        var renderTimeout = 1000;

        $scope.gridsterOpts = {
            columns: 10,
            resizable: {stop: onResize},
            draggable: {stop: onDrag}
        };

        $scope.updateOptions = function () {
            $scope.gridsterOpts = mergeGridsterOptions($scope.gridsterOpts, $scope.options);
            $scope.state = ($scope.gridsterOpts.resizable.enabled && $scope.gridsterOpts.draggable.enabled) ? 'unlocked' : 'locked';
        };

        $scope.renderDashboard = function () {

            $element.html('');
            if (!$scope.selectedDashboard.widgets.length) return;

            var template = '<div gridster="gridsterOpts">';
            $scope.selectedDashboard.widgets.forEach(function (widget, index) {
                template +=
                    `<li gridster-item row="${widget.position[0]}" col="${widget.position[1]}"
                         size-x="${widget.size.x}" size-y="${widget.size.y}" id="${widget._id}">

                        <widget-container dashboard-id="${$scope.selectedDashboard._id}" widget="selectedDashboard.widgets[${index}]">
                            <widget-${widget.type} class="widget" widget="selectedDashboard.widgets[${index}]">
                            </widget-${widget.type}>
                        </widget-container>
                    </li>`;
            });

            template += '</div>';

            var widgets = angular.element(template);
            $element.append(widgets);
            $compile(widgets)($scope);

            $timeout(function () {
                $scope.$broadcast('widgetReadyEvent');
            }, renderTimeout);
        };

        function onResize(event, element, widget, size) {
            var gridster = $scope.$$childHead.gridster,
                height = (gridster.curColWidth - gridster.margins[0] * 2) * size.y,
                width = (gridster.curRowHeight - gridster.margins[1] * 2) * size.x;

            $scope.$broadcast('widgetSizeChangeEvent:' + widget.id, width, height);
            DashboardWidgetService.moveWidget($scope.selectedDashboard._id, widget.id, {
                size: size
            });
        }

        function onDrag(event, element, widget, position) {
            $scope.$broadcast('widgetPositionChangeEvent:' + widget.id);
            DashboardWidgetService.moveWidget($scope.selectedDashboard._id, widget.id, {
                position: position
            });
        }
    }

    /**
     * Smart merge gridster options objects
     * @param destination
     * @param source
     * @returns {*}
     */
    function mergeGridsterOptions(destination, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                if (key === 'resizable' || key === 'draggable') {
                    if (typeof destination[key] === 'undefined') {
                        destination[key] = {};
                    }
                    for (var innerKey in source[key]) {
                        if (source[key].hasOwnProperty(innerKey)) {
                            destination[key][innerKey] = source[key][innerKey];
                        }
                    }
                }
                else {
                    destination[key] = source[key];
                }
            }
        }
        return destination;
    }

})();
