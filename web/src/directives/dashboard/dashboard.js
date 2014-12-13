'use strict';

angular.module('app.directives')
    .directive('dashboard', function(TemplatePath) {

    return {
        restrict: 'EA',
        replace: true,
        scope: {
            src: '='
        },
        templateUrl: TemplatePath.get('directive', 'dashboard'),
        link: function(scope, element) {
            console.log('link dashboard');

            scope.$watch('src', function(newDashboard) {
                if (typeof newDashboard === 'undefined') return;
                scope.renderDashboard();
            });

        },
        controller: function($scope, $element, $attrs, $compile) {

            $scope.renderDashboard = function() {
                console.log('render dashboard', $scope.src.name);

                $element.html('');
                if (!$scope.src.widgets.length) return;

                var template = '';
                $scope.src.widgets.forEach(function(widget, index) {
                    template += '<widget-' + widget.type + ' data="src.widgets['+index+'].data"></widget-' + widget.type + '>';
                });

                var widgets = angular.element(template);
                $element.append(widgets);
                $compile(widgets)($scope);
            }
        }
    }
});

