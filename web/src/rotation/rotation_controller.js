(function () {

    angular
        .module('teaparty2.rotation')
        .controller('RotationController', RotationController);

    function RotationController($scope, $window, $timeout, $state, $stateParams, Rotation, Dashboard) {

        var self = this;

        self.rotation = {};
        self.selectedDashboard = undefined;

        self.options = {
            resizable: {enabled: false},
            draggable: {enabled: false}
        };

        init();

        function init() {
            self.rotation = Rotation.get({ url: $stateParams.url },
                function (response) {

                    // Reload page with rotation if anything was changed there
                    $scope.$on(`rotationUpdateEvent:${response._id}`, function (event, rotation) {
                        $window.location.reload();
                    });

                    if (is.not.empty(response.dashboards)) loadDashboardByIndex(0);
                },
                () => $state.go('app')
            );
        }

        function loadDashboardByIndex(index) {
            if (self.rotation.dashboards.length <= index) index = 0;
            var dashboard = self.rotation.dashboards[index];

            Dashboard.get({dashboardId: dashboard._id}, function (data) {
                self.selectedDashboard = data;

                $timeout(function () {
                    loadDashboardByIndex(index + 1);
                }, self.rotation.dashboards[index].timeout * 1000);
            });
        }
    }

})();
