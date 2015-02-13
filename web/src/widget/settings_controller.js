(function () {

    angular
        .module('teaparty2.widget')
        .controller('WidgetSettingsController', WidgetSettingsController);

    function WidgetSettingsController($scope, $rootScope, ngDialog, Widget, DashboardWidgetService) {

        var self = this;

        self.removeWidget = removeWidget;
        self.cloneWidget = cloneWidget;

        function removeWidget() {
            var promise = DashboardWidgetService.removeWidgetFromDashboard($scope.ngDialogData.dashboardId, $scope.ngDialogData.widget._id);
            promise.then(function() {
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
                var promise = DashboardWidgetService.addWidgetToDashboard($scope.ngDialogData.dashboardId, createdWidget._id);
                promise.then(function() {
                    $rootScope.$broadcast('widgetAddedEvent', {
                        dashboardId: $scope.ngDialogData.dashboardId
                    });
                    ngDialog.close();

                }, showError);

            }, showError);
        }

        function showError(err) {
            self.error = err.data ? err.data.error : { message: 'Server is unavailable' };
        }
    }

})();
