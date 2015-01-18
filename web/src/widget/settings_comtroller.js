(function () {

    'use strict';

    angular
        .module('teaparty2.widget')
        .controller('WidgetSettingsController', WidgetSettingsController);

    function WidgetSettingsController($scope, $rootScope, ngDialog, Widget) {

        var self = this;

        self.removeWidget = removeWidget;
        self.cloneWidget = cloneWidget;

        function removeWidget() {
            Widget.delete({
                dashboard: $scope.ngDialogData.dashboardName,
                key: $scope.ngDialogData.widget.key
            }, function () {
                $rootScope.$broadcast('widgetDeletedEvent', {
                    dashboardName: $scope.ngDialogData.dashboardName
                });
                ngDialog.close();
            });
        }

        function cloneWidget() {
            var widget = new Widget({
                dashboard: $scope.ngDialogData.dashboardName,
                type: $scope.ngDialogData.widget.type,
                caption: $scope.ngDialogData.widget.caption
            });

            widget.$save(function () {
                $rootScope.$broadcast('widgetAddedEvent', {
                    dashboardName: $scope.ngDialogData.dashboardName
                });
                ngDialog.close();
            }, function (err) {
                self.error = err.data.error;
            });
        }
    }

})();
