(function () {

    angular
        .module('teaparty2.dashboard')
        .controller('DashboardSettingsController', DashboardSettingsController);

    function DashboardSettingsController($scope, $rootScope, $window, ngDialog, Dashboard) {

        var self = this;

        self.removeDashboard = removeDashboard;
        self.updateDashboard = updateDashboard;
        self.regenerateUrl = regenerateUrl;

        self.name = $scope.ngDialogData.dashboard.name;
        self.private = $scope.ngDialogData.dashboard.private;

        self.baseUrl = $window.location.origin + '/d/';

        function regenerateUrl() {
            Dashboard.update({
                dashboardId: $scope.ngDialogData.dashboard._id,
                url: true
            }, function (data) {
                $scope.ngDialogData.dashboard.url = data.url;
                sendUpdateMessage();
            }, showError);
        }

        function updateDashboard() {
            Dashboard.update({
                dashboardId: $scope.ngDialogData.dashboard._id,
                name: self.name,
                'private': self.private
            }, function () {
                $scope.ngDialogData.dashboard.name = self.name;
                $scope.ngDialogData.dashboard.private = self.private;
                sendUpdateMessage();
                ngDialog.close();
            }, showError);
        }

        function removeDashboard() {
            Dashboard.delete({dashboardId: $scope.ngDialogData.dashboard._id}, function () {
                $rootScope.$broadcast('dashboardDeletedEvent', {
                    dashboardName: $scope.ngDialogData.dashboard
                });
                ngDialog.close();
            });
        }

        function sendUpdateMessage() {
            $rootScope.$broadcast('dashboardUpdatedEvent');
        }

        function showError(err) {
            self.error = err.data ? err.data.error : { message: 'Server is unavailable' };
        }
    }

})();
