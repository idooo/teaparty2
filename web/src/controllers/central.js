'use strict';

/*
angular.module('teaparty2').factory('mySocket', function (socketFactory) {
  return socketFactory();
});
*/

angular.module('teaparty2').controller('CentralController', function(Auth, Dashboard) {

    var self = this;

    self.dashboards = [];
    self.selectedDashboard = undefined;
    self.loadDashboard = loadDashboard;

    Dashboard.list(function(data) {
        self.dashboards = data;
        if (self.dashboards.length) {
            loadDashboard(self.dashboards[0].name);
        }
    });

    function loadDashboard(dashboardName) {
        console.log(dashboardName);
        self.selectedDashboard = Dashboard.get({name: dashboardName});
    }

    //mySocket.emit('event1', 'test');
});
