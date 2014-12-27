'use strict';

angular.module("app.services")
    .factory('Auth', function($http, $q, localStorageService) {

        var authEndpoint = '/api/auth';

        var service = {
            token: undefined,
            isAuthorised: false,

            /**
             * Read auth token from the local storage
             * @returns {*}
             */
            readTokenFromStorage: function() {
                return localStorageService.get('token');
            },

            /**
             * Update the auth HTTP header by new token
             * @param token
             */
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
             * Save token to all the places, update the header
             * and execute the callback
             * @param token
             * @param callback (with argument 'isAuthorised' (bool))
             */
            authorize: function(token, callback) {
                service.token = token;
                service.isAuthorised = true;
                localStorageService.set('token', token);
                service.updateAuthHeader();
                if (typeof callback === 'function') callback(service.isAuthorised);
            },

            /**
             * Reset the auth token, update auth header and execute callback
             * @param callback (with argument 'isAuthorised' (bool))
             */
            deauthorize: function(callback) {
                service.token = undefined;
                service.isAuthorised = false;
                localStorageService.remove('token');
                service.updateAuthHeader();
                if (typeof callback === 'function') callback(service.isAuthorised);
            },

            /**
             * Auth user to get the auth token
             * @param username
             * @param password
             */
            auth: function(username, password) {
                var http = $http.post(authEndpoint, {
                    username: username,
                    password: password
                });

                http.success(function(data) {
                    service.authorize(data.token);
                });

                http.error(function() {
                    service.deauthorize();
                });
            },

            /**
             * Check token for validity
             * @param token
             * @param callback
             */
            check: function(token, callback) {
                var http;

                if (typeof token === 'undefined') {
                    token = service.readTokenFromStorage();
                    if (token === null) {
                        service.token = undefined;
                        // Create empty promise to have unified function return
                        // in case of error
                        var promise = $q(function(resolve, reject) {});
                        promise.success = function(){};
                        return promise;
                    }
                }

                http = $http.get(authEndpoint + '/' + token);

                http.success(function() {
                    service.authorize(token, callback);
                });

                http.error(function() {
                    service.deauthorize(callback);
                });
            }
        };

        return service;
    });
