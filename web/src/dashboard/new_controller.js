(function () {

    angular
        .module('teaparty2.dashboard')
        .controller('NewDashboardController', NewDashboardController);

    function NewDashboardController($rootScope, ngDialog, Dashboard) {

        var self = this;

        self.dashboardName = '';
        self.error = '';
        self.addDashboard = addDashboard;

        function addDashboard() {
            var dashboard = new Dashboard({name: self.dashboardName});
            dashboard.$save(function () {
                $rootScope.$broadcast('dashboardAddedEvent', dashboard);
                ngDialog.close();
            }, function (err) {
                self.error = err.data ? err.data.error : {message: 'Server is unavailable'};
            });
        }
    }

})();
