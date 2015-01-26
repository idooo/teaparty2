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
                scope.container = el.find('div')[0];
                scope.rendering = false;

                scope.render = function () {
                    if (typeof scope.widget.data.chart === 'undefined') scope.widget.data.chart = {};
                    scope.widget.data.chart.renderTo = scope.container;
                    scope.widget.data.chart.spacingTop = 30; // Add padding for header
                    scope.chart = new Highcharts.Chart(scope.widget.data);

                    scope.chartElement = Sizzle('.highcharts-container', scope.container)[0];
                };

                scope.render();
            },
            controller: function ($scope, $element, $attrs, $timeout, WidgetSubscriber) {

                $scope.reflow = function() {
                    startRendering();
                    $timeout(function() {
                        $scope.chart.reflow();
                        stopRendering();
                    }, 1000)
                };

                WidgetSubscriber.update($scope, function() { $scope.render(); });

                WidgetSubscriber.sizeChange($scope, function () { $scope.reflow(); });

                WidgetSubscriber.ready($scope, function () { $scope.reflow(); });

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
