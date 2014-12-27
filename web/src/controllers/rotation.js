'use strict';

angular
    .module('teaparty2')
    .controller('RotationController', RotationController);

function RotationController($timeout, $state, $stateParams, Rotation, Dashboard) {

    var self = this;

    self.rotation = {};
    self.selectedDashboard = undefined;

    self.options = {
        resizable: { enabled: false },
        draggable: { enabled: false }
    };

    init();

    function init() {
        self.rotation = Rotation.get({
            url: $stateParams.url
        }, function(response) {
            if (response.dashboards.length > 0) {
                loadDashboardByIndex(0);
            }
        }, function() {
            $state.go('app');
        })
    }

    function loadDashboardByIndex(index) {
        console.log('loadDashboardByIndex', index);

        if (self.rotation.dashboards.length <= index) index = 0;
        var dashboard = self.rotation.dashboards[index];

        Dashboard.get({name: dashboard.name}, function(data) {
            self.selectedDashboard = data;
            console.log(self.rotation.dashboards);

            $timeout(function() {
                console.log('timeout');
                loadDashboardByIndex(index + 1)
            }, self.rotation.dashboards[index].timeout * 1000)
        });
    }
}
