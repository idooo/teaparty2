(function() {

    'use strict';

    angular
        .module('teaparty2.core')
        .service('Auth', AuthService);

    function AuthService($http, localStorageService) {

        var self = this,
            endpoint = '/api/auth',
            header = 'Authorization-Token';

        self.token = undefined;
        self.isAuthorised = false;

        self.readTokenFromStorage = readTokenFromStorage;
        self.updateAuthHeader = updateAuthHeader;
        self.authorize = authorize;
        self.deauthorize = deauthorize;
        self.auth = auth;
        self.check = check;

        /**
         * Read auth token from the local storage
         * @returns {*}
         */
        function readTokenFromStorage() {
            return localStorageService.get('token');
        }

        /**
         * Update the auth HTTP header by new token
         * @param token
         */
        function updateAuthHeader(token) {
            if (typeof token === 'undefined') {
                if (typeof self.token === 'undefined') {
                    token = self.readTokenFromStorage();
                }
                else {
                    token = self.token;
                }
            }
            $http.defaults.headers.common[header] = token;
        }

        /**
         * Save token to all the places, update the header
         * and execute the callback
         * @param token
         * @param callback (with argument 'isAuthorised' (bool))
         */
        function authorize(token, callback) {
            self.token = token;
            self.isAuthorised = true;
            localStorageService.set('token', token);
            self.updateAuthHeader();
            if (typeof callback === 'function') callback(self.isAuthorised);
        }

        /**
         * Reset the auth token, update auth header and execute callback
         * @param callback (with argument 'isAuthorised' (bool))
         * @param message - optional message to pass to callback
         */
         function deauthorize(callback, message) {
            self.token = undefined;
            self.isAuthorised = false;
            localStorageService.remove('token');
            self.updateAuthHeader();
            if (typeof callback === 'function') {
                callback(self.isAuthorised, message);
            }
        }

        /**
         * Auth user to get the auth token
         * @param username
         * @param password
         * @param callback
         */
         function auth(username, password, callback) {
            var http = $http.post(endpoint, {
                username: username,
                password: password
            });

            http.success(function(data) {
                self.authorize(data.token, callback);
            });

            http.error(function(data) {
                self.deauthorize(callback, data);
            });
        }

        /**
         * Check token for validity
         * @param token
         * @param callback
         */
        function check(token, callback) {
            var http;

            if (typeof token === 'undefined') {
                token = self.readTokenFromStorage();
                if (token === null) {
                    self.token = undefined;
                }
            }

            http = $http.get(endpoint + '/' + token);

            http.success(function() {
                self.authorize(token, callback);
            });

            http.error(function() {
                self.deauthorize(callback);
            });
        }
    }

})();
