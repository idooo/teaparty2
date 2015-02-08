(function () {

    angular
        .module('teaparty2.dashboard')
        .controller('DashboardSettingsController', DashboardSettingsController);

    function DashboardSettingsController($scope, $rootScope, ngDialog, Dashboard) {

        var self = this;

        self.removeDashboard = function (dashboardId) {
            Dashboard.delete({dashboardId: dashboardId}, function () {
                $rootScope.$broadcast('dashboardDeletedEvent', {
                    dashboardName: $scope.ngDialogData.dashboard
                });
                ngDialog.close();
            });
        };
    }

})();
