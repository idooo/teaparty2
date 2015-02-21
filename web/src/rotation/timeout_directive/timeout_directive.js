(function () {

    angular
        .module('teaparty2.widget')
        .directive('timeout', timeoutDirective);

    function timeoutDirective() {
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

    function link(scope) {
        scope.id = Math.random();
        scope.isPopoverOpened = false;
        scope.closePopover = () => scope.isPopoverOpened = false;
    }

    function controller($scope, $element, $attrs, $rootScope, Rotation) {
        $scope.$on('popoverOpenEvent', function(event, data) {
            if (is.not.undefined(data) && data.id !== $scope.id) {
                $scope.closePopover();
            }
        });

        $scope.togglePopover = function() {
            $rootScope.$broadcast('popoverOpenEvent', {id: $scope.id});
            $scope.isPopoverOpened = !$scope.isPopoverOpened;
        };

        $scope.setDashboardTimeout = function(rotation, dashboard, timeout) {
            $scope.closePopover();
            Rotation.updateDashboard({
                rotationId: rotation._id,
                dashboardID: dashboard._id,
                timeout: timeout
            }, function () {
                dashboard.timeout = timeout;
            });
        }
    }

})();
