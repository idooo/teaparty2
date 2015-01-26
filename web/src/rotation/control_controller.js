(function () {

    'use strict';

    angular
        .module('teaparty2.rotation')
        .controller('RotationsControlController', RotationsControlController);

    function RotationsControlController($window, Rotation, Dashboard) {

        var self = this;

        self.rotations = [];
        self.dashboards = [];
        self.selectedRotation = undefined;

        self.removeRotation = removeRotation;
        self.createRotation = createRotation;
        self.removeDashboardFromRotation = removeDashboardFromRotation;
        self.setDashboardTimeout = setDashboardTimeout;
        self.addDashboardToRotation = addDashboardToRotation;
        self.isDashboardInSelectedRotation = isDashboardInSelectedRotation;
        self.selectRotation = selectRotation;
        self.getRotationUrl = getRotationUrl;

        init();

        function init() {
            self.rotations = Rotation.list();
            self.dashboards = Dashboard.list();
        }

        function createRotation() {
            (new Rotation()).$save();
            self.rotations = Rotation.list();
        }

        function removeRotation(rotation) {
            Rotation.delete({url: rotation.url});
            for (var i = 0; i < self.rotations.length; i++) {
                if (rotation.url === self.rotations[i].url) return self.rotations.splice(i, 1);
            }
        }

        function removeDashboardFromRotation(rotation, dashboard) {
            Rotation.removeDashboard({
                url: rotation.url,
                dashboardID: dashboard._id
            }, function () {
                for (var i = 0; i < rotation.dashboards.length; i++) {
                    if (rotation.dashboards[i]._id === dashboard._id) return rotation.dashboards.splice(i, 1);
                }
            });
        }

        function setDashboardTimeout(rotation, dashboard, timeout) {
            Rotation.updateDashboard({
                url: rotation.url,
                dashboardID: dashboard._id,
                timeout: timeout
            }, function () {
                dashboard.timeout = timeout;
            });
        }

        function addDashboardToRotation(rotation, dashboard) {
            Rotation.addDashboard({
                url: rotation.url,
                dashboardID: dashboard._id
            }, function () {
                rotation.dashboards.push(dashboard);
            });
        }

        function isDashboardInSelectedRotation(dashboard) {
            if (typeof self.selectedRotation === 'undefined') return false;

            for (var i = 0; i < self.selectedRotation.dashboards.length; i++) {
                if (self.selectedRotation.dashboards[i]._id === dashboard._id) return true;
            }
            return false;
        }

        function selectRotation(rotation) {
            self.selectedRotation = rotation;
        }

        function getRotationUrl(rotation) {
            return $window.location.origin + '/rotation/' + rotation.url;
        }
    }

})();
