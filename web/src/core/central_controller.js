(function () {

    'use strict';

    angular
        .module('teaparty2.core')
        .controller('CentralController', CentralController);

    function CentralController($rootScope, $scope, $state, $stateParams, ngDialog, Dashboard, Sockets) {

        var self = this;

        var NG_DIALOG_DEFAULT_THEME = 'ngdialog-theme-default',
            NG_DIALOG_WIDE_MODIFIER = 'ngdialog-theme-default--wide';

        self.dashboards = [];
        self.dashboardOptions = {
            resizable: {enabled: false},
            draggable: {enabled: false}
        };
        self.selectedDashboard = undefined;

        self.loadDashboard = loadDashboard;
        self.goToDashboard = goToDashboard;
        self.lockUnlockDashboard = lockUnlockDashboard;

        // Modals openers
        self.showNewDashboardDialog = showNewDashboardDialog;
        self.showNewWidgetDialog = showNewWidgetDialog;
        self.showRotationsDialog = showRotationsDialog;
        self.showLoginDialog = showLoginDialog;
        self.showDashboardSettingsDialog = showDashboardSettingsDialog;

        self.isHeaderOpen = false;
        self.isDashboardLocked = true;

        Sockets.on('update_widgets', function (data) {
            data.forEach(function (updateObject) {
                $scope.$broadcast('widgetUpdateEvent:' + updateObject.key, updateObject.data);
            });
        });

        $scope.$on('dashboardAddedEvent', function () {
            $rootScope.dashboards = [];
            init();
        });

        $scope.$on('dashboardDeletedEvent', function () {
            $rootScope.dashboards = [];
            init();
        });

        $scope.$on('widgetAddedEvent', function (event, data) {
            for (var i = 0; i < self.dashboards.length; i++) {
                if (self.dashboards[i].name === data.dashboardName) {
                    return loadDashboard(i);
                }
            }
        });

        $scope.$on('widgetDeletedEvent', function (event, data) {
            for (var i = 0; i < self.dashboards.length; i++) {
                if (self.dashboards[i].name === data.dashboardName) {
                    return loadDashboard(i);
                }
            }
        });

        $scope.$on('userAuthEvent', function () {
            getDashboardsList(function (dashboards) {
                $rootScope.dashboards = dashboards;
            });
        });

        init();

        function init() {

            var selectDashboard = function (dashboards) {
                if (typeof $stateParams.dashboard !== 'undefined' && $stateParams.dashboard) {
                    for (var i = 0; i < dashboards.length; i++) {
                        if (dashboards[i].url === $stateParams.dashboard) return loadDashboard(i);
                    }
                    $state.go('app', {dashboard: ''});
                }
                return loadDashboard(0);
            };

            if (typeof $rootScope.dashboards === 'undefined' || $rootScope.dashboards.length === 0) {
                getDashboardsList(function (dashboards) {
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
            Dashboard.list(function (data) {
                self.dashboards = data;
                if (self.dashboards.length && typeof callback === 'function') {
                    callback(self.dashboards);
                }
            });
        }

        function loadDashboard(index) {
            var dashboard = self.dashboards[index];
            Dashboard.get({name: dashboard.name}, function (data) {
                self.selectedDashboard = data;
                self.isDashboardLocked = true;
            });
        }

        function lockUnlockDashboard() {
            self.isDashboardLocked = !self.isDashboardLocked;
            self.dashboardOptions.resizable.enabled = !self.dashboardOptions.resizable.enabled;
            self.dashboardOptions.draggable.enabled = !self.dashboardOptions.draggable.enabled;
        }

        // Modals
        // ------------------------------------------------------------------------------------------

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

        function showRotationsDialog() {
            ngDialog.open({
                className: [NG_DIALOG_DEFAULT_THEME, NG_DIALOG_WIDE_MODIFIER].join(' '),
                template: 'views/modal/rotations_control.html',
                controller: 'RotationsControlController as ctrl'
            });
        }

        function showLoginDialog() {
            ngDialog.open({
                template: 'views/modal/login.html',
                controller: 'LoginController as ctrl'
            });
        }

        function showDashboardSettingsDialog() {
            ngDialog.open({
                template: 'views/modal/dashboard_settings.html',
                controller: 'DashboardSettingsController as ctrl',
                data: {
                    dashboard: self.selectedDashboard
                }
            });
        }
    }

})();
