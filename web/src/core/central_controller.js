(function () {

    angular
        .module('teaparty2.core')
        .controller('CentralController', CentralController);

    function CentralController ($rootScope, $scope, $state, $stateParams, ModalService,
								Dashboard, Settings, Auth) {

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
        self.logout = logout;

        // Modals
        self.showNewDashboardDialog = ModalService.newDashboard;
        self.showRotationsDialog = ModalService.rotations;
        self.showLoginDialog = ModalService.login;
        self.showDashboardSettingsDialog = () => ModalService.dashboardSettings({dashboard: self.selectedDashboard});
        self.showNewWidgetDialog = () => ModalService.newWidget({dashboard: self.selectedDashboard});

        self.isHeaderOpen = false;
        self.isDashboardLocked = true;

        Settings.get().then(s => self.settings = s);

        init();

        // Bind event handlers
        // ------------------------------------------------------------------------------------------

        $scope.$on('dashboardAddedEvent', function (event, dashboard) {
            $stateParams.dashboard = dashboard.url;
            init(true);
        });

        $scope.$on('dashboardDeletedEvent', () => init(true));

        $scope.$on('dashboardUpdatedEvent', function (event, data) {
            if (data.reload) init();
            else getDashboardsList(dashboards => $rootScope.dashboards = dashboards);
        });

        $scope.$on('widgetAddedEvent', (event, data) => loadDashboard(data.dashboardId));

        $scope.$on('widgetDeletedEvent', (event, data) => loadDashboard(data.dashboardId));

        $scope.$on('userAuthEvent', function () {
            getDashboardsList(function (dashboards) {
                $rootScope.dashboards = dashboards;
            });
            loadDashboard(self.selectedDashboard._id);
        });

        // Main functions
        // ------------------------------------------------------------------------------------------

        /**
         * Initialisation.
         * Get the dashboard list (try to get from cache if it's available), cache it and load dashboard
         * @param cleanCache {boolean}
         */
        function init (cleanCache=false) {

            if (cleanCache) $rootScope.dashboards = [];

            var selectDashboard = function (dashboards) {
                if (angular.isDefined($stateParams.dashboard) && $stateParams.dashboard) {
                    for (let dashboard of dashboards) {
                        if (dashboard.url === $stateParams.dashboard) return loadDashboard(dashboard);
                    }
                    $state.go('app', {dashboard: ''});
                }
                return loadDashboard();
            };

            if (angular.isUndefined($rootScope.dashboards) || $rootScope.dashboards.length === 0) {
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
        function goToDashboard (url) {
            $state.go('app', {dashboard: url}, {reload: false});
        }

        /**
         * Get list of dashboards available for the current user
         * @param callback ([dashboards list])
         */
        function getDashboardsList (callback) {
            Dashboard.list(function (data) {
                self.dashboards = data;
                if (angular.isFunction(callback)) callback(self.dashboards);
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
        function loadDashboard (input) {
            var dashboard;

            if (angular.isUndefined(input)) {
                if (self.dashboards.length === 0) return;
                dashboard = self.dashboards[0];
            }
            else if (angular.isString(input)) {
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
        function lockUnlockDashboard () {
            self.isDashboardLocked = !self.isDashboardLocked;
            self.dashboardOptions.resizable.enabled = !self.dashboardOptions.resizable.enabled;
            self.dashboardOptions.draggable.enabled = !self.dashboardOptions.draggable.enabled;
        }

        /**
         * Check if dashboards are available
         * @returns {boolean}
         */
        function isAnyDashboardAvailable () {
            if (!self.settings.isDatabaseConnected) {
                self.importantMessage = IMPORTANT_MESSAGES[0];
                return false;
            }
            else if (self.dashboards.length === 0) {
                self.importantMessage = IMPORTANT_MESSAGES[1];
                return false;
            }
            self.importantMessage = '';
            return true;
        }

        /**
         * Log out
         */
        function logout () {
            Auth.deauthorize();
            $rootScope.dashboards = undefined;
            $rootScope.isAuthorised = false;
            $state.go('app', {dashboard: ''});
        }
    }

})();
