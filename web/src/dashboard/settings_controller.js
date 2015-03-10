(function () {

    angular
        .module('teaparty2.dashboard')
        .controller('DashboardSettingsController', DashboardSettingsController);

    function DashboardSettingsController($scope, $rootScope, $window, ngDialog, Dashboard) {

        var self = this;

        self.removeDashboard = removeDashboard;
        self.updateDashboard = updateDashboard;
        self.regenerateUrl = regenerateUrl;
        self.getDashboardUrl = getDashboardUrl;

        self.name = $scope.ngDialogData.dashboard.name;
        self.private = $scope.ngDialogData.dashboard.private;
        self.columns = $scope.ngDialogData.dashboard.columns || 10;
        self.IPAddressRange = $scope.ngDialogData.dashboard.IPAddressRange;
        self.IPWhitelistPolicy = $scope.ngDialogData.dashboard.IPWhitelistPolicy;

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
                columns: self.columns,
                'private': self.private,
                IPAddressRange: self.IPAddressRange,
                IPWhitelistPolicy: self.IPWhitelistPolicy
            }, function () {
                var data = {};

                $scope.ngDialogData.dashboard.name = self.name;
                $scope.ngDialogData.dashboard.private = self.private;
                $scope.ngDialogData.dashboard.IPWhitelistPolicy = self.IPWhitelistPolicy;
                $scope.ngDialogData.dashboard.IPAddressRange = self.IPAddressRange;

                if ($scope.ngDialogData.dashboard.columns !== self.columns) {
                    $scope.ngDialogData.dashboard.columns = self.columns;
                    data.reload = true;
                }

                sendUpdateMessage(data);
                ngDialog.close();
            }, showError);
        }

        function getDashboardUrl() {
            return self.baseUrl + $scope.ngDialogData.dashboard.url;
        }

        function removeDashboard() {
            Dashboard.delete({dashboardId: $scope.ngDialogData.dashboard._id}, function () {
                $rootScope.$broadcast('dashboardDeletedEvent', {
                    dashboardName: $scope.ngDialogData.dashboard
                });
                ngDialog.close();
            });
        }

        function sendUpdateMessage(data) {
            $rootScope.$broadcast('dashboardUpdatedEvent', data);
        }

        function showError(err) {
            self.error = err.data ? err.data.error : { message: 'Server is unavailable' };
        }
    }

})();
