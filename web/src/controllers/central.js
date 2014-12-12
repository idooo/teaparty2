'use strict';

/*
angular.module('teaparty2').factory('mySocket', function (socketFactory) {
  return socketFactory();
});
*/

angular.module('teaparty2').controller('CentralController', function($rootScope, Auth, Dashboard) {

    var self = this;

    self.dashboards = [];
    self.loadDashboard = loadDashboard;
    $rootScope.selectedDashboard = undefined;

    Dashboard.list(function(data) {
        self.dashboards = data;
        if (self.dashboards.length) {
            loadDashboard(self.dashboards[0]);
        }
    });

    function loadDashboard(dashboard) {
        console.log('loadDashboard', dashboard.name);
        Dashboard.get({name: dashboard.name}, function(data) {
            $rootScope.selectedDashboard = data;
        });
    }

    //mySocket.emit('event1', 'test');
});
