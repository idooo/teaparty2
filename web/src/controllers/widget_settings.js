'use strict';

angular
    .module('teaparty2')
    .controller('WidgetSettingsController', WidgetSettingsController);

function WidgetSettingsController($scope, $rootScope, ngDialog, Widget) {

    var self = this;

    self.removeWidget = function() {
        Widget.delete({
            dashboard: $scope.ngDialogData.dashboardName,
            key: $scope.ngDialogData.widget.key
        }, function() {
            console.log('widget removed', $scope.ngDialogData.widget.key);
            $rootScope.$broadcast('widgetDeletedEvent', {
                dashboardName: $scope.ngDialogData.dashboardName
            });
            ngDialog.close();
        });
    };

    self.cloneWidget = function() {
        var widget = new Widget({
            dashboard: $scope.ngDialogData.dashboardName,
            type: $scope.ngDialogData.widget.type,
            caption: $scope.ngDialogData.widget.caption
        });

        widget.$save(function(data) {
            console.log('widget cloned', data);
            $rootScope.$broadcast('widgetAddedEvent', {
                dashboardName: $scope.ngDialogData.dashboardName
            });
            ngDialog.close();
        }, function(err) {
            console.log('err', err);
            self.error = err.data.error;
        });
    }
}
