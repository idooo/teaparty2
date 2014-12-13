'use strict';

angular.module('app.directives')
    .directive('dashboard', function(TemplatePath) {

    return {
        restrict: 'EA',
        replace: true,
        templateUrl: TemplatePath.get('directive', 'dashboard'),
        link: function(scope) {
            console.log('link dashboard');

            scope.$watch('central.selectedDashboard', function(newDashboard) {
                if (typeof newDashboard === 'undefined') return;
                scope.renderDashboard();
            });

        },
        controller: function($scope, $element, $attrs, $compile) {

            $scope.renderDashboard = function() {
                console.log('render dashboard', $scope.central.selectedDashboard.name);

                $element.html('');
                if (!$scope.central.selectedDashboard.widgets.length) return;

                var template = '';
                $scope.central.selectedDashboard.widgets.forEach(function(widget, index) {
                    template += [
                        '<widget-container dashboard-name="' + $scope.central.selectedDashboard.name + '" widget-key="' + widget.key + '">',
                            '<widget-' + widget.type + ' widget="central.selectedDashboard.widgets['+index+']">',
                            '</widget-' + widget.type + '>',
                        '</widget-container>'
                    ].join('');
                });

                var widgets = angular.element(template);
                $element.append(widgets);
                $compile(widgets)($scope);
            }
        }
    }
});

