'use strict';

angular.module('app.directives')
    .directive('dashboardSelect', function(TemplatePath) {

    return {
        restrict: 'EA',
        replace: true,
        scope: {
            options: '=',
            selected: '=',
            onChange: '=',
            onRemove: '='
        },
        templateUrl: TemplatePath.get('directive', 'dashboard_select'),
        link: function(scope) {
            scope.showDropdown = false;

            scope.select = function(index) {
                scope.selectedElement = scope.options[index];
                scope.showDropdown = false;
                scope.onChange(index);
            };

            scope.removeDashboard = function(dashboardName) {
                scope.onRemove(dashboardName);
            }
        },
        controller: function($scope) {
            var listener = $scope.$watch("options", function (newValue) {
                if (typeof newValue !== 'undefined' && newValue.length > 0) {
                    $scope.selectedElement = newValue[0];
                    listener();
                }
            });
        }
    }
});
