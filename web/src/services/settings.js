'use strict';

angular.module("app.services")
    .factory('Settings', function($http) {
        var settingsEndpoint = '/api/settings';
        var service = {
            settings: undefined,
            get: function(callback) {
                var http;

                if (typeof service.settings !== 'undefined') {
                    if (typeof callback === 'function') callback(service.settings);
                    return service.settings;
                }

                http = $http.get(settingsEndpoint);

                http.success(function(data) {
                    service.settings = data;
                    if (typeof callback === 'function') callback(service.settings);
                });

                http.error(function() {
                    if (typeof callback === 'function') callback();
                });

                return http;
            }
        };

        return service;
    });
