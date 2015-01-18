(function () {

    'use strict';

    angular
        .module('teaparty2.rotation')
        .factory('Rotation', RotationResource);

    function RotationResource($resource) {
        return $resource('/api/rotation/:url', {
                url: '@url',
                dashboardID: '@dashboardID'
            },
            {
                update: {
                    method: 'PUT'
                },
                list: {
                    method: 'GET',
                    isArray: true,
                    url: '/api/rotations'
                },
                addDashboard: {
                    url: '/api/rotation/:url/:dashboardID',
                    method: 'POST'
                },
                removeDashboard: {
                    url: '/api/rotation/:url/:dashboardID',
                    method: 'DELETE'
                },
                updateDashboard: {
                    url: '/api/rotation/:url/:dashboardID',
                    method: 'PUT'
                }
            });
    }

})();
