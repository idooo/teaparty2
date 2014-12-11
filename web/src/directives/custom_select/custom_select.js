'use strict';

angular.module('app.widgets')
    .directive('customSelect', function(TemplatePath) {

    return {
        restrict: 'EA',
        replace: true,
        scope: {
            options: '=',
            selected: '=',
            field: '@',
            onChange: '='
        },
        templateUrl: TemplatePath.get('directive', 'custom_select'),
        link: function(scope) {
            scope.showDropdown = false;

            scope.select = function(item) {
                scope.selected = item;
                scope.showDropdown = false;
                scope.onChange(item[scope.field], item);
            }
        }
    }
});
