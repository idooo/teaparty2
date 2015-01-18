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
                scope.render = function () {
                    if (typeof scope.widget.data.chart === 'undefined') scope.widget.data.chart = {};
                    scope.widget.data.chart.renderTo = el[0];
                    scope.chart = new Highcharts.Chart(scope.widget.data);
                };

                scope.render();
            },
            controller: function ($scope, $element, $attrs, WidgetSubscriber) {

                WidgetSubscriber.update($scope, $scope.render);

                WidgetSubscriber.sizeChange($scope, function () {
                    $scope.chart.reflow();
                });

                WidgetSubscriber.ready($scope, function () {
                    $scope.chart.reflow();
                });
            }
        }
    });
