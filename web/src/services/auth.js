'use strict';

angular.module("app.services")
    .factory('Auth', function($http, $q, localStorageService) {

        var service = {
            endpoint: '/api/auth',
            header: 'Authorization-Token',
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
                $http.defaults.headers.common[service.header] = token;
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
             * @param message - optional message to pass to callback
             */
            deauthorize: function(callback, message) {
                service.token = undefined;
                service.isAuthorised = false;
                localStorageService.remove('token');
                service.updateAuthHeader();
                if (typeof callback === 'function') {
                    callback(service.isAuthorised, message);
                }
            },

            /**
             * Auth user to get the auth token
             * @param username
             * @param password
             * @param callback
             */
            auth: function(username, password, callback) {
                var http = $http.post(service.endpoint, {
                    username: username,
                    password: password
                });

                http.success(function(data) {
                    service.authorize(data.token, callback);
                });

                http.error(function(data) {
                    service.deauthorize(callback, data);
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
                    }
                }

                http = $http.get(service.endpoint + '/' + token);

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
