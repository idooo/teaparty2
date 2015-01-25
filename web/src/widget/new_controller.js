(function () {

    'use strict';

    angular
        .module('teaparty2.widget')
        .controller('NewWidgetController', NewWidgetController);

    function NewWidgetController($scope, $rootScope, ngDialog, Settings, Widget) {

        var self = this;

        self.availableWidgetTypes = [];
        self.widgetType = undefined;
        self.widgetCaption = '';
        self.error = '';

        self.addWidget = addWidget;

        Settings.get(function (settings) {
            self.availableWidgetTypes = settings.widgetTypes;
            if (self.availableWidgetTypes.length !== 0) self.widgetType = self.availableWidgetTypes[0];
        });

        function addWidget() {
            var widget = new Widget({
                dashboard: $scope.ngDialogData.dashboard.name,
                type: self.widgetType,
                caption: self.widgetCaption
            });

            widget.$save(function () {
                $rootScope.$broadcast('widgetAddedEvent', {
                    dashboardName: $scope.ngDialogData.dashboard.name
                });
                ngDialog.close();
            }, function (err) {
                self.error = err.data ? err.data.error : { message: "Server is unavailable" };
            });
        }
    }

})();
