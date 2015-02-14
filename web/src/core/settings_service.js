(function () {

    angular
        .module('teaparty2.core')
        .service('Settings', SettingsService);

    function SettingsService($http, $q) {

        const ENDPOINT = '/api/settings';

        var self = this;

        self.settings = undefined;

        self.get = function () {
            return $q(function(resolve, reject) {
                var http;

                if (is.not.undefined(self.settings)) return resolve(self.settings);

                http = $http.get(ENDPOINT);
                http.success(function (data) {
                    self.settings = data;
                    resolve(self.settings);
                });
                http.error(() => reject());
            });
        };
    }

})();
