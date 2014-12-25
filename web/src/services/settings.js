'use strict';

angular.module("app.services")
    .factory('Settings', function($http) {
        var settingsEndpoint = '/api/settings';
        var service = {
            settings: undefined,
            get: function(callback) {

                if (typeof service.settings !== 'undefined') return service.settings;

                var http = $http.get(settingsEndpoint);

                http.success(function(data) {
                    service.settings = data;
                    if (typeof callback === 'function') callback(service.settings);
                });

                http.error(function() {
                    if (typeof callback === 'function') callback();
                })
            }
        };

        return service;
    });
