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
                new Highcharts.Chart(scope.widget.data);
            };
            scope.render();
        },
        controller: function($scope, $element, $attrs, Subscriber)  {
            Subscriber.subscribe($scope, function() {
                 $scope.render();
            });
        }
    }
});
