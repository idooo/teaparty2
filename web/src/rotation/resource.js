(function () {

    angular
        .module('teaparty2.rotation')
        .factory('Rotation', RotationResource);

    function RotationResource($resource) {
        return $resource('/api/rotation/:url', {
                rotationId: '@rotationId',
                dashboardID: '@dashboardID'
            },
            {
                'delete': {
                    url: '/api/rotation/:rotationId',
                    method: 'DELETE'
                },
                update: {
                    method: 'PUT'
                },
                list: {
                    method: 'GET',
                    isArray: true,
                    url: '/api/rotations'
                },
                addDashboard: {
                    url: '/api/rotation/:rotationId/:dashboardID',
                    method: 'POST'
                },
                removeDashboard: {
                    url: '/api/rotation/:rotationId/:dashboardID',
                    method: 'DELETE'
                },
                updateDashboard: {
                    url: '/api/rotation/:rotationId/:dashboardID',
                    method: 'PUT'
                }
            });
    }

})();
