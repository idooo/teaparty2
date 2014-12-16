'use strict';

angular
    .module('teaparty2')
    .controller('CentralController', function($rootScope, $scope, $state, $stateParams, ngDialog, Auth, Dashboard, Widget, Sockets) {

        var self = this;

        self.dashboards = [];
        self.selectedDashboard = undefined;

        self.loadDashboard = loadDashboard;
        self.showNewDashboardDialog = showNewDashboardDialog;
        self.showNewWidgetDialog = showNewWidgetDialog;
        self.goToDashboard = goToDashboard;
        self.removeDashboard = removeDashboard;

        Sockets.on('update_widgets', function(data) {
            console.log('update_widgets', data);
            data.forEach(function(updateObject) {
                $scope.$broadcast('widgetUpdateEvent:' + updateObject.key, updateObject.data);
            });
        });

        $scope.$on('dashboardAddedEvent', function() {
            $rootScope.dashboards = [];
            init();
        });

        $scope.$on('widgetAddedEvent', function(event, data) {
            for (var i=0; i<self.dashboards.length; i++) {
                if (self.dashboards[i].name === data.dashboardName) {
                    return loadDashboard(i);
                }
            }
        });

        init();

        function init() {

            var selectDashboard = function(dashboards) {
                if (typeof $stateParams.dashboard !== 'undefined' && $stateParams.dashboard) {
                    for (var i = 0; i < dashboards.length; i++) {
                        if (dashboards[i].url === $stateParams.dashboard) return loadDashboard(i);
                    }
                    $state.go('app', {dashboard: ''});
                }
                return loadDashboard(0);
            };

            if (typeof $rootScope.dashboards === 'undefined' || $rootScope.dashboards.length === 0) {
                getDashboardsList(function(dashboards) {
                    $rootScope.dashboards = dashboards;
                    selectDashboard(dashboards);
                });
            }
            else {
                self.dashboards = $rootScope.dashboards;
                selectDashboard(self.dashboards);
            }
        }

        function goToDashboard(url) {
            $state.go('app', {dashboard: url}, {reload: false});
        }

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
                self.selectedDashboard = data;
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

        function showNewWidgetDialog() {
            ngDialog.open({
                template: 'views/modal/new_widget.html',
                controller: 'NewWidgetController as ctrl',
                data: {
                    dashboard: self.selectedDashboard
                }
            });
        }

});
