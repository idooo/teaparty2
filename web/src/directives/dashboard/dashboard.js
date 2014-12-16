'use strict';

angular.module('app.directives')
    .directive('dashboard', function(TemplatePath) {

    return {
        restrict: 'EA',
        replace: true,
        scope: {
            widgets: '=',
            selectedDashboard: '=src'
        },
        templateUrl: TemplatePath.get('directive', 'dashboard'),
        link: function(scope) {
            console.log('link dashboard');

            scope.$watch('selectedDashboard', function(newDashboard) {
                if (typeof newDashboard === 'undefined') return;
                scope.renderDashboard();
            });

        },
        controller: function($scope, $element, $attrs, $compile, Widget) {

            $scope.gridsterOpts = {
                resizable: {
                    stop: onResize
                },
                draggable: {
                    stop: onDrag
                }
            };

            $scope.renderDashboard = function() {
                console.log('render dashboard', $scope.selectedDashboard.name);

                $element.html('');
                if (!$scope.selectedDashboard.widgets.length) return;

                var template = '<div gridster="gridsterOpts">';
                $scope.selectedDashboard.widgets.forEach(function(widget, index) {
                    template += [
                        '<li gridster-item row="' + widget.position[0] + '" col="' + widget.position[1] + '" ',
                            'size-x="' + widget.size.x + '" size-y="' + widget.size.y + '" key="'+ widget.key +'">',

                            '<widget-container dashboard-name="' + $scope.selectedDashboard.name + '" widget-key="' + widget.key + '">',
                                '<widget-' + widget.type + ' widget="selectedDashboard.widgets['+index+']">',
                                '</widget-' + widget.type + '>',
                            '</widget-container>',

                        '</li>'
                    ].join('');
                });

                template += '</div>';

                var widgets = angular.element(template);
                $element.append(widgets);
                $compile(widgets)($scope);
            };

            function onResize(event, $element, widget, size) {
                console.log('resize stop - new size arg:', size);
                Widget.update({
                    dashboard: $scope.selectedDashboard.name,
                    key: widget.key,
                    size: size
                });
            }

            function onDrag(event, $element, widget, position) {
                console.log('drag stop - new position arg:', position);
                Widget.update({
                    dashboard: $scope.selectedDashboard.name,
                    key: widget.key,
                    position: position
                });
            }
        }
    }
});

