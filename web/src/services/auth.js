'use strict';

angular.module("app.services")
    .factory('Auth', function($http, $q, localStorageService) {

        var service = {
            token: undefined,
            isAuthorised: false,

            /**
             * Auth user to get the auth token
             * @param username
             * @param password
             * @returns {Promise}
             */
            auth: function(username, password) {
                var http = $http.post('/api/auth', {
                    username: username,
                    password: password
                });

                http.success(function(data) {
                    localStorageService.set('token', data.token);
                    service.token = data.token;
                    service.isAuthorised = true;
                });

                http.error(function() {
                    service.token = undefined;
                    service.isAuthorised = false;
                    localStorageService.remove('token')
                });

                return http;
            },

            /**
             * Check token for validity
             * @param userToken
             * @param isAuthorised
             * @returns {Promise}
             */
            check: function(userToken, callback) {
                var http;

                if (typeof userToken === 'undefined') {
                    userToken = localStorageService.get('token');
                    if (userToken === null) {
                        service.token = undefined;
                        // Create empty promise to have unified function return
                        // in case of error
                        var promise = $q(function(resolve, reject) {});
                        promise.success = function(){};
                        return promise;
                    }
                }

                http = $http.get('/api/auth/' + userToken);

                http.success(function() {
                    service.token = userToken;
                    service.isAuthorised = true;
                    if (typeof callback === 'function') callback(service.isAuthorised);
                });

                http.error(function() {
                    service.token = undefined;
                    service.isAuthorised = false;
                    localStorageService.remove('token');
                    if (typeof callback === 'function') callback(service.isAuthorised);
                });

                return http;
            }
        };

        return service;
    });
