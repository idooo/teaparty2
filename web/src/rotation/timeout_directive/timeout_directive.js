(function () {

    angular
        .module('teaparty2.widget')
        .directive('timeout', timeoutDirective);

    function timeoutDirective () {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                dashboard: '=',
                rotation: '='
            },
            templateUrl: 'rotation/timeout_directive/timeout_directive.template',
            link: link,
            controller: controller
        };
    }

    function link (scope) {
        scope.id = Math.random();
        scope.availableTimeouts = [15, 30, 45, 60];
    }

    function controller ($scope, Rotation) {

        $scope.setDashboardTimeout = function (timeout) {
            Rotation.updateDashboard({
                rotationId: $scope.rotation._id,
                dashboardID: $scope.dashboard._id,
                timeout: timeout
            }, function () {
                $scope.dashboard.timeout = timeout;
            });
        };
    }

})();
