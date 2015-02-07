(function () {

    angular
        .module('teaparty2.widget')
        .controller('NewWidgetController', NewWidgetController);

    function NewWidgetController($scope, $rootScope, ngDialog, Settings, Widget, DashboardWidgetService) {

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
                type: self.widgetType,
                caption: self.widgetCaption
            });

            widget.$save(function (createdWidget) {

                DashboardWidgetService.addWidgetToDashboard(
                    $scope.ngDialogData.dashboard._id,
                    createdWidget._id,
                    function(err) {
                        if (err !== null) return showError(err);

                        $rootScope.$broadcast('widgetAddedEvent', {
                            dashboardId: $scope.ngDialogData.dashboard._id
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
