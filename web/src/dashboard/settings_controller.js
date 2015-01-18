(function () {

    'use strict';

    angular
        .module('teaparty2.dashboard')
        .controller('DashboardSettingsController', DashboardSettingsController);

    function DashboardSettingsController($scope, $rootScope, ngDialog, Dashboard) {

        var self = this;

        self.removeDashboard = function (dashboardName) {
            Dashboard.delete({name: dashboardName}, function () {
                $rootScope.$broadcast('dashboardDeletedEvent', {
                    dashboardName: $scope.ngDialogData.dashboard
                });
                ngDialog.close();
            });
        };
    }

})();
