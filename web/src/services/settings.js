'use strict';

angular.module("app.services")
    .service('Settings', function($http) {

        var self = this,
            settingsEndpoint = '/api/settings';

        self.settings = undefined;

        self.get = function(callback) {
            var http;

            if (typeof self.settings !== 'undefined') {
                if (typeof callback === 'function') callback(self.settings);
                return self.settings;
            }

            http = $http.get(settingsEndpoint);

            http.success(function(data) {
                self.settings = data;
                if (typeof callback === 'function') callback(self.settings);
            });

            http.error(function() {
                if (typeof callback === 'function') callback();
            });

            return http;
        }
    });
