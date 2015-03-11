(function () {

    angular
        .module('teaparty2.widget')
        .controller('WidgetSettingsController', WidgetSettingsController);

    function WidgetSettingsController($scope, $rootScope, ngDialog, Widget, DashboardWidgetService) {

        var self = this;

        self.availableDashboards = [];

        self.removeWidget = removeWidget;
        self.cloneWidget = cloneWidget;
        self.updateWidget = updateWidget;
        self.moveToDashboard = moveToDashboard;

        self.caption = $scope.ngDialogData.widget.caption;

        $rootScope.dashboards.map(function(dashboard) {
            if (dashboard._id !== $scope.ngDialogData.dashboardId) {
                self.availableDashboards.push(dashboard.name);
            }
        });

        /**
         * Update widget data
         */
        function updateWidget() {
            Widget.update({
                widgetId: $scope.ngDialogData.widget._id,
                caption: self.caption
            }, function () {
                $scope.ngDialogData.widget.caption = self.caption;
                ngDialog.close();
            }, showError);
        }

        /**
         * Surprise. Removing widget
         */
        function removeWidget() {
            var promise = DashboardWidgetService.removeWidgetFromDashboard($scope.ngDialogData.dashboardId, $scope.ngDialogData.widget._id);
            promise.then(function() {
                $rootScope.$broadcast('widgetDeletedEvent', {
                    dashboardId: $scope.ngDialogData.dashboardId
                });
                ngDialog.close();
            });
        }

        /**
         * Create a copy of widget in the same dashboard
         */
        function cloneWidget() {

            var widget = new Widget({
                type: $scope.ngDialogData.widget.type,
                caption: $scope.ngDialogData.widget.caption
            });

            widget.$save(function (createdWidget) {
                var promise = DashboardWidgetService.addWidgetToDashboard($scope.ngDialogData.dashboardId, createdWidget._id);
                promise.then(function() {
                    $rootScope.$broadcast('widgetAddedEvent', {
                        dashboardId: $scope.ngDialogData.dashboardId
                    });
                    ngDialog.close();

                }, showError);

            }, showError);
        }

        /**
         * Move widget tot dashboard by dashboard name
         * @param dashboardName
         */
        /*eslint-disable no-loop-func */
        function moveToDashboard(dashboardName) {
            for (let dashboard of $rootScope.dashboards) {
                if (dashboard.name === dashboardName) {
                    var promise = DashboardWidgetService.moveWidgetToDashboard(
                        $scope.ngDialogData.dashboardId,
                        dashboard._id,
                        $scope.ngDialogData.widget._id
                    );

                    return promise.then(function() {
                        $rootScope.$broadcast('widgetAddedEvent', {
                            dashboardId: dashboard._id
                        });
                        $rootScope.$broadcast('widgetDeletedEvent', {
                            dashboardId: $scope.ngDialogData.dashboardId
                        });
                        ngDialog.close();
                    });
                }
            }
        }
        /*eslint-enable no-loop-func */

        function showError(err) {
            self.error = err.data ? err.data.error : { message: 'Server is unavailable' };
        }
    }

})();
