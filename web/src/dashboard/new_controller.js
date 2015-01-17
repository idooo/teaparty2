'use strict';

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
        dashboard.$save(function() {
            console.log('dashboard added');
            $rootScope.$broadcast('dashboardAddedEvent', dashboard);
            ngDialog.close();
        }, function(err) {
            console.log('err', err);
            self.error = err.data;
        });
    }
}
