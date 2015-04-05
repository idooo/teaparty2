(function () {

    angular
        .module('teaparty2.rotation')
        .controller('RotationController', RotationController);

    function RotationController($scope, $window, $timeout, $state, $stateParams, Rotation, Dashboard) {

        const PAUSE_DELAY = 5 * 60 * 1000; // 5 min

        var self = this;

        var currentIndex = 0,
            timer,
            pauseTimer,
            rotation;

        self.selectedDashboard = undefined;
        self.paused = false;

        self.options = {
            resizable: {enabled: false},
            draggable: {enabled: false}
        };

        rotation = Rotation.get({url: $stateParams.url}, init, () => $state.go('app'));

        function init(_rotation) {
            // Reload page with rotation if anything was changed there
            $scope.$on(`rotationUpdateEvent:${_rotation._id}`, function (event, data) {
                if (data._id !== _rotation._id) return;
                $window.location.reload();
            });

            $scope.$on(`rotationControlEvent:${_rotation._id}`, function (event, data) {
                if (data._id !== _rotation._id) return;
                switch (data.type) {
                    case 'pause': pauseRotation(); break;
                    case 'resume': resumeRotation(); break;
                    case 'selectDashboard': selectDashboard(data.dashboardId); break;
                }
            });

            if (rotation.dashboards.length !== 0) loadDashboardByIndex(currentIndex);
        }

        function pauseRotation() {
            if (angular.isUndefined(pauseTimer)) {
                $timeout.cancel(timer);
                self.paused = true;
                pauseTimer = $timeout(function () {
                    resumeRotation();
                }, PAUSE_DELAY)
            }
        }

        function resumeRotation() {
            setDashboardTimer(currentIndex);
            $timeout.cancel(pauseTimer);
            pauseTimer = undefined;
        }

        function selectDashboard(dashboardId) {
            for (let i = 0; i < rotation.dashboards.length; i++) {
                if (rotation.dashboards[i]._id === dashboardId) return loadDashboardByIndex(i);
            }
        }

        function setDashboardTimer(index) {
            self.paused = false;
            $timeout.cancel(timer);
            timer = $timeout(function () {
                loadDashboardByIndex(index + 1);
            }, rotation.dashboards[index].timeout * 1000);
        }

        function loadDashboardByIndex(index) {
            if (rotation.dashboards.length <= index) index = 0;
            var dashboard = rotation.dashboards[index];
            currentIndex = index;

            Dashboard.get({dashboardId: dashboard._id}, function (data) {
                self.selectedDashboard = data;
                setDashboardTimer(index);
            }, function() {
                loadDashboardByIndex(index + 1);
            });
        }
    }

})();
