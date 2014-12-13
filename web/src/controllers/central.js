'use strict';

angular
    .module('teaparty2')
    .controller('CentralController', function($scope, ngDialog, Auth, Dashboard, Sockets) {

        var self = this;

        self.dashboards = [];
        self.loadDashboard = loadDashboard;
        self.showNewDashboardDialog = showNewDashboardDialog;
        self.removeDashboard = removeDashboard;
        self.selectedDashboard = undefined;

        Sockets.on('update_widgets', function(data) {
            console.log('update_widgets', data);
        });

        $scope.$on('dashboardAddedEvent', function(event, addedDashboard) {
            getDashboardsList(function(dashboards) {
                for (var i=0; i<dashboards.length; i++) {
                    if (dashboards[i].name === addedDashboard.name) {
                        return loadDashboard(i);
                    }
                }
            })
        });

        getDashboardsList(function() {
            loadDashboard(0);
        });

        function getDashboardsList(callback) {
            Dashboard.list(function(data) {
                self.dashboards = data;
                if (self.dashboards.length && typeof callback === 'function') {
                    callback(self.dashboards);
                }
            });
        }

        function loadDashboard(index) {
            var dashboard = self.dashboards[index];
            console.log('loadDashboard', dashboard.name);
            Dashboard.get({name: dashboard.name}, function(data) {
                $scope.selectedDashboard = data;
            });
        }

        function removeDashboard(dashboardName) {
            Dashboard.delete({name: dashboardName}, function(data) {
                for (var i=0; i<self.dashboards.length; i++) {
                    if (dashboardName === self.dashboards[i].name) {
                        self.dashboards[i].deleted = true;
                    }
                }
            });
        }

        function showNewDashboardDialog() {
            ngDialog.open({
                template: 'views/modal/new_dashboard.html',
                controller: 'NewDashboardController as ctrl'
            });
        }

});
