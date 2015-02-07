(function () {

    angular
        .module('teaparty2.widget')
        .controller('WidgetSettingsController', WidgetSettingsController);

    function WidgetSettingsController($scope, $rootScope, ngDialog, Widget, DashboardWidgetService) {

        var self = this;

        self.removeWidget = removeWidget;
        self.cloneWidget = cloneWidget;

        function removeWidget() {
            DashboardWidgetService.removeWidgetFromDashboard(
                $scope.ngDialogData.dashboardId,
                $scope.ngDialogData.widget._id,
                function () {
                    $rootScope.$broadcast('widgetDeletedEvent', {
                        dashboardId: $scope.ngDialogData.dashboardId
                    });
                    ngDialog.close();
                });
        }

        function cloneWidget() {

            var widget = new Widget({
                type: $scope.ngDialogData.widget.type,
                caption: $scope.ngDialogData.widget.caption
            });

            widget.$save(function (createdWidget) {

                DashboardWidgetService.addWidgetToDashboard(
                    $scope.ngDialogData.dashboardId,
                    createdWidget._id,
                    function(err) {
                        if (err !== null) return showError(err);

                        $rootScope.$broadcast('widgetAddedEvent', {
                            dashboardId: $scope.ngDialogData.dashboardId
                        });
                        ngDialog.close();
                    });
            }, showError);
        }

        function showError(err) {
            self.error = err.data ? err.data.error : { message: 'Server is unavailable' };
        }
    }

})();
