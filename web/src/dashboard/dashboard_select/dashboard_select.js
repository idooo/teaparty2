(function () {

    angular
        .module('teaparty2.dashboard')
        .directive('dashboardSelect', dashboardSelectDirective);

    function dashboardSelectDirective () {

        return {
            restrict: 'EA',
            replace: true,
            scope: {
                options: '=',
                selected: '=',
                onChange: '=',
                onRemove: '='
            },
            templateUrl: 'dashboard/dashboard_select/dashboard_select.template',
            link: function (scope) {
                scope.showDropdown = false;

                scope.select = function (index) {
                    scope.showDropdown = false;
                    scope.onChange(index);
                };

                scope.removeDashboard = function (dashboardName) {
                    scope.onRemove(dashboardName);
                };
            }
        };
    }

})();
