'use strict';

angular
    .module('teaparty2')
    .controller('NewWidgetController', function($scope, $rootScope, ngDialog, Widget) {

        var self = this;

        self.addWidget = addWidget;
        self.widgetType = 'status'; // TODO: moar types plz

        function addWidget() {
            var widget = new Widget({
                dashboard: $scope.ngDialogData.dashboard.name,
                type: self.widgetType,
                caption: self.widgetCaption
            });

            widget.$save(function(data) {
                console.log('widget added', data);
                $rootScope.$broadcast('widgetAddedEvent', {
                    dashboardName: $scope.ngDialogData.dashboard.name
                });
                ngDialog.close();
            }, function(err) {
                console.log('err', err);
                self.error = err.data.error;
            });
        }
});
