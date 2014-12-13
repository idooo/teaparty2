'use strict';

angular
    .module('teaparty2')
    .controller('NewDashboardController', function(ngDialog, Dashboard) {

        var self = this;

        self.dashboardName = '';
        self.error = '';
        self.addDashboard = addDashboard;

        function addDashboard() {
            var dashboard = new Dashboard({name: self.dashboardName});
            dashboard.$save(function(data) {
                console.log('dashboard added');
                ngDialog.close();
            }, function(err) {
                console.log('err', err);
                self.error = err.data.error;
            });
        }
});