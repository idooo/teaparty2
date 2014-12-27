'use strict';

angular.module("app.services")
    .factory('Auth', function($http, $q, localStorageService) {

        // TODO: refactor

        var service = {
            token: undefined,
            isAuthorised: false,

            readTokenFromStorage: function() {
                return localStorageService.get('token');
            },

            updateAuthHeader: function(token) {
                if (typeof token === 'undefined') {
                    if (typeof service.token === 'undefined') {
                        token = service.readTokenFromStorage()
                    }
                    else {
                        token = service.token;
                    }
                }
                $http.defaults.headers.common.AuthorizationToken = token;
            },

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
                    service.updateAuthHeader()
                });

                http.error(function() {
                    service.token = undefined;
                    service.isAuthorised = false;
                    localStorageService.remove('token');
                    service.updateAuthHeader()
                });

                return http;
            },

            /**
             * Check token for validity
             * @param userToken
             * @param callback
             * @returns {Promise}
             */
            check: function(userToken, callback) {
                var http;

                if (typeof userToken === 'undefined') {
                    userToken = service.readTokenFromStorage();
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
                    service.updateAuthHeader();
                });

                http.error(function() {
                    service.token = undefined;
                    service.isAuthorised = false;
                    localStorageService.remove('token');
                    service.updateAuthHeader();
                    if (typeof callback === 'function') callback(service.isAuthorised);
                });

                return http;
            }
        };

        return service;
    });
