(function () {

    angular
        .module('teaparty2.widget')
        .controller('WidgetSettingsController', WidgetSettingsController);

    function WidgetSettingsController($scope, $rootScope, ngDialog, Widget, DashboardWidgetService) {

        var self = this;

        self.removeWidget = removeWidget;
        self.cloneWidget = cloneWidget;
        self.updateWidget = updateWidget;

        self.caption = $scope.ngDialogData.widget.caption;

        function updateWidget() {
            Widget.update({
                widgetId: $scope.ngDialogData.widget._id,
                caption: self.caption
            }, function () {
                $scope.ngDialogData.widget.caption = self.caption;
                ngDialog.close();
            }, showError);
        }

        function removeWidget() {
            var promise = DashboardWidgetService.removeWidgetFromDashboard($scope.ngDialogData.dashboardId, $scope.ngDialogData.widget._id);
            promise
                .then(function() {
                    return Widget.delete({ widgetId: $scope.ngDialogData.widget._id})
                })
                .then(function() {
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
