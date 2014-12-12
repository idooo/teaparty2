'use strict';

angular.module('app.directives')
    .directive('customSelect', function(TemplatePath) {

    return {
        restrict: 'EA',
        replace: true,
        scope: {
            options: '=',
            onChange: '=',
            selected: '@',
            field: '@'
        },
        templateUrl: TemplatePath.get('directive', 'custom_select'),
        link: function(scope) {
            scope.showDropdown = false;

            scope.select = function(item) {
                scope.selectedElement = item;
                scope.showDropdown = false;
                scope.onChange(item);
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
