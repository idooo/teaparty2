'use strict';

angular
    .module('teaparty2')
    .controller('RotationController', function(ngDialog, Rotation, Dashboard) {

        var self = this;

        self.rotations = [];
        self.dashboards = [];

        self.removeRotation = removeRotation;
        self.createRotation = createRotation;
        self.removeDashboardFromRotation = removeDashboardFromRotation;
        self.setDashboardTimeout = setDashboardTimeout;
        self.addDashboardToRotation = addDashboardToRotation;
        self.isDashboardInRotation = isDashboardInRotation;

        init();

        function init() {
            self.rotations = Rotation.list();
            self.dashboards = Dashboard.list();
        }

        function createRotation() {
            (new Rotation()).$save();
        }

        function removeRotation(rotation) {
            Rotation.delete({url: rotation.url});
            rotation.deleted = true;
        }

        function removeDashboardFromRotation(rotation, dashboard) {
            Rotation.removeDashboard({
                url: rotation.url,
                dashboardID: dashboard._id
            }, function(){
                for (var i=0; i<rotation.dashboards.length; i++) {
                    if (rotation.dashboards[i]._id === dashboard._id) return rotation.dashboards.splice(i, 1);
                }
            })
        }

        function setDashboardTimeout(rotation, dashboard, timeout) {
            Rotation.updateDashboard({
                url: rotation.url,
                dashboardID: dashboard._id,
                timeout: timeout
            }, function(){
                dashboard.timeout = timeout;
            })
        }

        function addDashboardToRotation(rotation, dashboard) {
            Rotation.addDashboard({
                url: rotation.url,
                dashboardID: dashboard._id
            }, function () {
                rotation.dashboards.push(dashboard);
            });
        }

        function isDashboardInRotation(rotation, dashboardID) {
            for (var i=0; i<rotation.dashboards.length; i++) {
                if (rotation.dashboards[i]._id === dashboardID) return true;
            }
            return false;
        }
});
