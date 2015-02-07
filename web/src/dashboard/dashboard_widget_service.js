(function () {

    angular
        .module('teaparty2.dashboard')
        .service('DashboardWidgetService', DashboardWidgetService);

    function DashboardWidgetService($http) {
        var self = this;

        self.addWidgetToDashboard = addWidgetToDashboard;
        self.removeWidgetFromDashboard = removeWidgetFromDashboard;
        self.moveWidget = moveWidget;

        function addWidgetToDashboard(dashboardId, widgetId, callback) {
            serviceCall('post', getEndpoint(dashboardId, widgetId), undefined, callback);
        }

        function removeWidgetFromDashboard(dashboardId, widgetId, callback) {
            serviceCall('delete', getEndpoint(dashboardId, widgetId), undefined, callback);
        }

        function moveWidget(dashboardId, widgetId, data, callback) {
            serviceCall('post', getEndpoint(dashboardId, widgetId) + '/move', data, callback);
        }

        function serviceCall(methodName, url, data, callback) {
            var http = $http[methodName](url, data);
            http.success(function(_data) {
                if (typeof callback === 'function') callback(null, _data);
            });
            http.error(function(err, _data) {
                if (typeof callback === 'function') callback(err, _data);
            });
        }

        function getEndpoint(dashboardId, widgetId) {
            return `/api/dashboard/${dashboardId}/widget/${widgetId}`;
        }
    }

})();
