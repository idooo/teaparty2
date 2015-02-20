(function () {

    angular
        .module('teaparty2.rotation')
        .controller('RotationsControlController', RotationsControlController);

    function RotationsControlController($window, Rotation, Dashboard) {

        var self = this;

        self.baseUrl = $window.location.origin + '/rotation/';

        self.rotations = [];
        self.dashboards = [];
        self.selectedRotation = undefined;

        self.createRotation = createRotation;
        self.removeDashboardFromRotation = removeDashboardFromRotation;
        self.setDashboardTimeout = setDashboardTimeout;
        self.addDashboardToRotation = addDashboardToRotation;
        self.isDashboardInSelectedRotation = isDashboardInSelectedRotation;

        // Simple view changer
        self.openDashboards = openDashboards;
        self.deselectRotation = deselectRotation;
        self.openSettings = openSettings;

        // 0 - rotations list
        // 1 - settings
        // 2 - dashboards
        self.view = 0;

        self.getRotationUrl = getRotationUrl;

        // Rotation settings
        self.updateRotation = updateRotation;
        self.regenerateUrl = regenerateUrl;
        self.removeRotation = removeRotation;

        init();

        function init() {
            self.rotations = Rotation.list();
            self.dashboards = Dashboard.list();
        }

        function createRotation() {
            (new Rotation()).$save();
            self.rotations = Rotation.list();
        }

        function removeDashboardFromRotation(rotation, dashboard) {
            Rotation.removeDashboard({
                rotationId: rotation._id,
                dashboardID: dashboard._id
            }, function () {
                for (var i = 0; i < rotation.dashboards.length; i++) {
                    if (rotation.dashboards[i]._id === dashboard._id) return rotation.dashboards.splice(i, 1);
                }
            });
        }

        function setDashboardTimeout(rotation, dashboard, timeout) {
            Rotation.updateDashboard({
                rotationId: rotation._id,
                dashboardID: dashboard._id,
                timeout: timeout
            }, function () {
                dashboard.timeout = timeout;
            });
        }

        function addDashboardToRotation(rotation, dashboard) {
            Rotation.addDashboard({
                rotationId: rotation._id,
                dashboardID: dashboard._id
            }, function () {
                rotation.dashboards.push(dashboard);
            });
        }

        function isDashboardInSelectedRotation(dashboard) {
            if (typeof self.selectedRotation === 'undefined' || typeof self.selectedRotation.dashboards === 'undefined') {
                return false;
            }

            for (var i = 0; i < self.selectedRotation.dashboards.length; i++) {
                if (self.selectedRotation.dashboards[i]._id === dashboard._id) return true;
            }
            return false;
        }

        function openDashboards(rotation) {
            self.selectedRotation = rotation;
            self.view = 2;
        }

        function openSettings(rotation) {
            self.selectedRotation = rotation;
            self.name = rotation.name;
            self.view = 1;
        }

        function deselectRotation() {
            self.selectedRotation = undefined;
            self.view = 0;
        }

        function getRotationUrl(rotation) {
            return self.baseUrl + rotation.url;
        }

        function updateRotation() {
            Rotation.update({
                rotationId: self.selectedRotation._id,
                name: self.name
            }, function () {
                self.selectedRotation.name = self.name;
            }, showError);
        }

        function regenerateUrl() {
            Rotation.update({
                rotationId: self.selectedRotation._id,
                url: true
            }, function (data) {
                self.selectedRotation.url = data.url;
            }, showError);
        }

        function removeRotation(rotation) {
            Rotation.delete({rotationId: rotation._id});
            for (var i = 0; i < self.rotations.length; i++) {
                if (rotation._id === self.rotations[i]._id) return self.rotations.splice(i, 1);
            }
        }

        function showError(err) {
            self.error = err.data ? err.data.error : { message: 'Server is unavailable' };
        }
    }

})();
