(function () {

    angular
        .module('teaparty2.core')
        .service('Settings', SettingsService);

    function SettingsService($http) {

        const ENDPOINT = '/api/settings';

        var self = this;

        self.settings = undefined;

        self.get = function (callback) {

            if (is.not.undefined(self.settings) && is.function(callback)) return callback(self.settings);

            var http = $http.get(ENDPOINT);

            http.success(function (data) {
                self.settings = data;
                if (is.function(callback)) callback(self.settings);
            });

            http.error(function () {
                if (is.function(callback)) callback();
            });
        };
    }

})();
