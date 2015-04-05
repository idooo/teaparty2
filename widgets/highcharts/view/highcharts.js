'use strict';

angular.module('teaparty2.widgets')
    .directive('widgetHighcharts', function (TemplatePath, $timeout, WidgetSubscriber) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                widget: '=widget'
            },
            templateUrl: TemplatePath.get('highcharts'),
            link: function (scope, element) {
                var chartContainer = element.find('div')[0],
                    chartElement;

                scope.rendering = false;

                WidgetSubscriber.update(scope, function() { repaint(); });

                WidgetSubscriber.sizeChange(scope, function () { repaint(); });

                WidgetSubscriber.ready(scope, function () {
                    createHighcharts();
                    chartElement = Sizzle('.highcharts-container', chartContainer)[0];
                });

                function createHighcharts () {
                    if (angular.isUndefined(scope.widget.data.chart)) scope.widget.data.chart = {};
                    scope.widget.data.chart.renderTo = chartContainer;
                    scope.chart = new Highcharts.Chart(scope.widget.data);
                }

                // Repaint Highcharts
                function repaint() {
                    startRendering();
                    $timeout(function() {
                        scope.chart.reflow();
                        stopRendering();
                    }, 1000)
                }

                function startRendering() {
                    scope.rendering = true;
                    chartElement.style.display = 'none';
                }

                function stopRendering() {
                    scope.rendering = false;
                    chartElement.style.display = 'block';
                }
            }
        }
    });
