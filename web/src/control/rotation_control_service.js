(function () {

    angular
        .module('teaparty2.control')
        .service('RotationControlService', rotationControlService);

    function rotationControlService($http, $q) {

        const ENDPOINT = '/api/control/rotation';

        var self = this;

        self.pauseRotation = pauseRotation;
        self.resumeRotation = resumeRotation;
        self.changeDashboard = changeDashboard;

        function pauseRotation(rotationId) {
            return serviceCallFactory(`${ENDPOINT}/${rotationId}/pause`);
        }

        function resumeRotation(rotationId) {
            return serviceCallFactory(`${ENDPOINT}/${rotationId}/resume`);
        }

        function changeDashboard(rotationId, dashboardId) {
            return serviceCallFactory(`${ENDPOINT}/${rotationId}/${dashboardId}`);
        }

        /**
         * Generate service call promise
         * @param url
         * @returns {Promise}
         */
        function serviceCallFactory(url) {
            return $q(function(resolve, reject) {
                var http = $http.post(url);
                http.success(_data => resolve(_data));
                http.error((err, _data) => reject(err, _data));
            });
        }
    }

})();
