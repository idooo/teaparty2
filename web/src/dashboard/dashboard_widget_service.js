(function () {

    angular
        .module('teaparty2.dashboard')
        .service('DashboardWidgetService', DashboardWidgetService);

    function DashboardWidgetService($http, $q) {
        var self = this;

        self.addWidgetToDashboard = addWidgetToDashboard;
        self.removeWidgetFromDashboard = removeWidgetFromDashboard;
        self.moveWidget = moveWidget;
        self.moveWidgetToDashboard = moveWidgetToDashboard;

        function addWidgetToDashboard(dashboardId, widgetId) {
            return serviceCallFactory('post', getEndpoint(dashboardId, widgetId));
        }

        function removeWidgetFromDashboard(dashboardId, widgetId) {
            return serviceCallFactory('delete', getEndpoint(dashboardId, widgetId));
        }

        function moveWidget(dashboardId, widgetId, data) {
            return serviceCallFactory('post', getEndpoint(dashboardId, widgetId) + '/move', data);
        }

        function moveWidgetToDashboard(dashboardSrcId, dashboardDestId, widgetId) {
            return serviceCallFactory('post', getEndpoint(dashboardSrcId, widgetId) + `/move/${dashboardDestId}`);
        }

        /**
         * Generate service call promise
         * @param methodName
         * @param url
         * @param data
         * @returns {Promise}
         */
        function serviceCallFactory(methodName, url, data={}) {
            return $q(function(resolve, reject) {
                var http = $http[methodName](url, data);
                http.success(_data => resolve(_data));
                http.error((err, _data) => reject(err, _data));
            });
        }

        function getEndpoint(dashboardId, widgetId) {
            return `/api/dashboard/${dashboardId}/widget/${widgetId}`;
        }
    }

})();
