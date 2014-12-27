'use strict';

angular.module('app.widgets')
    .directive('widgetHighcharts', function(TemplatePath) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            widget: '=widget'
        },
        templateUrl: TemplatePath.get('widget', 'highcharts'),
        link: function(scope, el) {

            scope.render = function() {
                if (typeof scope.widget.data.chart === 'undefined') scope.widget.data.chart = {};
                scope.widget.data.chart.renderTo = el[0];
                scope.chart = new Highcharts.Chart(scope.widget.data);
            };

            scope.render();

            setTimeout(function() {
                scope.chart.reflow();
            }, 1000);
        },
        controller: function($scope, $element, $attrs, WidgetSubscriber)  {
            WidgetSubscriber.update($scope, function() {
                $scope.render();
            });

            WidgetSubscriber.sizeChange($scope, function() {
                $scope.chart.reflow();
            })
        }
    }
});