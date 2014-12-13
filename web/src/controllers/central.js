'use strict';

angular
    .module('teaparty2')
    .controller('CentralController', function($rootScope, ngDialog, Auth, Dashboard, Sockets) {

        var self = this;

        self.dashboards = [];
        self.loadDashboard = loadDashboard;
        self.showNewDashboardDialog = showNewDashboardDialog;

        $rootScope.selectedDashboard = undefined;

        Dashboard.list(function(data) {
            self.dashboards = data;
            if (self.dashboards.length) {
                loadDashboard(self.dashboards[0]);
            }
        });

        Sockets.on('update_widgets', function(data) {
            console.log('update_widgets', data);
        });

        function loadDashboard(dashboard) {
            console.log('loadDashboard', dashboard.name);
            Dashboard.get({name: dashboard.name}, function(data) {
                $rootScope.selectedDashboard = data;
            });
        }

        function showNewDashboardDialog() {
            ngDialog.open({
                template: 'views/modal/new_dashboard.html',
                controller: 'NewDashboardController as ctrl'
            });
        }

});
