(function () {

    angular
        .module('teaparty2.dashboard')
        .factory('Dashboard', DashboardResource);

    function DashboardResource($resource) {
        return $resource('/api/dashboard/:dashboardId', {dashboardId: '@dashboardId'}, {
            list: {
                method: 'GET',
                isArray: true,
                url: '/api/dashboards'
            }
        });
    }

})();
