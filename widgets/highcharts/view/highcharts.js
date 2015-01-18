'use strict';

angular.module('teaparty2.widgets')
    .directive('widgetHighcharts', function (TemplatePath) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                widget: '=widget'
            },
            templateUrl: TemplatePath.get('highcharts'),
            link: function (scope, el) {
                scope.container = el.find('div');
                scope.rendering = false;
                scope.chartElement = undefined;

                scope.render = function () {
                    if (typeof scope.widget.data.chart === 'undefined') scope.widget.data.chart = {};
                    scope.widget.data.chart.renderTo = scope.container[0];
                    scope.chart = new Highcharts.Chart(scope.widget.data);

                    scope.chartElement = Sizzle('.highcharts-container')[0];
                };

                scope.render();
            },
            controller: function ($scope, $element, $attrs, $timeout, WidgetSubscriber) {

                WidgetSubscriber.update($scope, $scope.render);

                WidgetSubscriber.sizeChange($scope, function () {
                    startRendering();
                    $timeout(function() {
                        $scope.chart.reflow();
                        stopRendering();
                    }, 1000)
                });

                WidgetSubscriber.ready($scope, function () {
                    $scope.chart.reflow();
                });

                function startRendering() {
                    $scope.rendering = true;
                    $scope.chartElement.style.display = 'none';
                }

                function stopRendering() {
                    $scope.rendering = false;
                    $scope.chartElement.style.display = 'block';
                }
            }
        }
    });
