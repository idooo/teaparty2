(function () {

    angular
        .module('teaparty2.core')
        .controller('CentralController', CentralController);

    function CentralController($rootScope, $scope, $state, $stateParams, ModalsService, Dashboard, Sockets, Settings) {

        const IMPORTANT_MESSAGES = [
            'Database connection problem. Check application logs for details',
            'You have no dashboards'
        ];

        var self = this;

        self.dashboards = [];
        self.importantMessage = '';
        self.dashboardOptions = {
            resizable: {enabled: false},
            draggable: {enabled: false}
        };
        self.selectedDashboard = undefined;

        self.goToDashboard = goToDashboard;
        self.lockUnlockDashboard = lockUnlockDashboard;
        self.isAnyDashboardAvailable = isAnyDashboardAvailable;

        // Modals
        self.showNewDashboardDialog = ModalsService.newDashboard;
        self.showRotationsDialog = ModalsService.rotations;
        self.showLoginDialog = ModalsService.login;
        self.showDashboardSettingsDialog = () => ModalsService.dashboardSettings({dashboard: self.selectedDashboard});
        self.showNewWidgetDialog = () => ModalsService.newWidget({dashboard: self.selectedDashboard});

        self.isHeaderOpen = false;
        self.isDashboardLocked = true;

        Settings.get(function(s) { self.settings = s; } );

        init();

        // Bind events
        // ------------------------------------------------------------------------------------------

        Sockets.on('update_widgets', function (data) {
            data.forEach(function (updateObject) {
                $scope.$broadcast('widgetUpdateEvent:' + updateObject.key, updateObject.data);
            });
        });

        $scope.$on('dashboardAddedEvent', function (event, dashboard) {
            $stateParams.dashboard = dashboard.url;
            $rootScope.dashboards = [];
            init();
        });

        $scope.$on('dashboardDeletedEvent', function () {
            $rootScope.dashboards = [];
            init();
        });

        $scope.$on('widgetAddedEvent', function (event, data) {
            loadDashboard(data.dashboardId);
        });

        $scope.$on('widgetDeletedEvent', function (event, data) {
            loadDashboard(data.dashboardId);
        });

        $scope.$on('userAuthEvent', function () {
            getDashboardsList(function (dashboards) {
                $rootScope.dashboards = dashboards;
            });
        });

        // Main functions
        // ------------------------------------------------------------------------------------------

        /**
         * Initialisation of controller
         */
        function init() {

            var selectDashboard = function (dashboards) {
                if (is.not.undefined($stateParams.dashboard) && $stateParams.dashboard) {
                    for (let dashboard of dashboards) {
                        if (dashboard.url === $stateParams.dashboard) return loadDashboard(dashboard);
                    }
                    $state.go('app', {dashboard: ''});
                }
                return loadDashboard();
            };

            if (is.undefined($rootScope.dashboards) || is.empty($rootScope.dashboards)) {
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

        /**
         * Redirect to a specific dashboard
         * @param url
         */
        function goToDashboard(url) {
            $state.go('app', {dashboard: url}, {reload: false});
        }

        /**
         * Get list of dashboards available for the current user
         * @param callback ([dashboards list])
         */
        function getDashboardsList(callback) {
            Dashboard.list(function (data) {
                self.dashboards = data;
                if (is.function(callback)) {
                    callback(self.dashboards);
                }
            });
        }

        /**
         * Load dashboard by 'input'
         * if 'input' is:
         *   - undefined - load the first dashboard
         *   - string - load by id (expecting string representation of ObjectId)
         *   - object - load this dashboard object
         *
         * @param input
         */
        function loadDashboard(input) {
            var dashboard;

            if (is.undefined(input)) {
                if (is.empty(self.dashboards)) return;
                dashboard = self.dashboards[0];
            }
            else if (is.string(input)) {
                for (let _dashboard of self.dashboards) {
                    if (_dashboard._id === input) {
                        dashboard = _dashboard;
                        break;
                    }
                }
            }
            else {
                dashboard = input;
            }

            Dashboard.get({dashboardId: dashboard._id}, function (data) {
                self.selectedDashboard = data;
                self.isDashboardLocked = true;
            });
        }

        /**
         * Lock/Unlock dashboard by changing Gridster options
         */
        function lockUnlockDashboard() {
            self.isDashboardLocked = !self.isDashboardLocked;
            self.dashboardOptions.resizable.enabled = !self.dashboardOptions.resizable.enabled;
            self.dashboardOptions.draggable.enabled = !self.dashboardOptions.draggable.enabled;
        }

        /**
         * Check if dashboards are available
         * @returns {boolean}
         */
        function isAnyDashboardAvailable() {
            if (!self.settings.isDatabaseConnected) {
                self.importantMessage = IMPORTANT_MESSAGES[0];
                return false;
            }
            else if (is.empty(self.dashboards)) {
                self.importantMessage = IMPORTANT_MESSAGES[1];
                return false;
            }
            self.importantMessage = '';
            return true;
        }

    }

})();
