(function() {

    angular
        .module('teaparty2.core')
        .service('Auth', AuthService);

    function AuthService($http, localStorageService) {

        const ENDPOINT = '/api/auth';
        const HEADER = 'Authorization-Token';
        const LS_KEY = 'token';

        var self = this;

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
            return localStorageService.get(LS_KEY);
        }

        /**
         * Update the auth HTTP header by new token
         * @param token
         */
        function updateAuthHeader(token) {
            if (is.not.undefined(token)) {
                if (is.not.undefined(self.token)) {
                    token = self.readTokenFromStorage();
                }
                else {
                    token = self.token;
                }
            }
            $http.defaults.headers.common[HEADER] = token;
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
            localStorageService.set(LS_KEY, token);
            self.updateAuthHeader();
            if (is.function(callback)) {
                callback(self.isAuthorised);
            }
        }

        /**
         * Reset the auth token, update auth header and execute callback
         * @param callback (with argument 'isAuthorised' (bool))
         * @param message - optional message to pass to callback
         */
         function deauthorize(callback, message) {
            self.token = undefined;
            self.isAuthorised = false;
            localStorageService.remove(LS_KEY);
            self.updateAuthHeader();
            if (is.function(callback)) {
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
            var http = $http.post(ENDPOINT, {
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

            if (is.not.undefined(token)) {
                token = self.readTokenFromStorage();
                if (is.null(token)) {
                    self.token = undefined;
                }
            }

            http = $http.get(`${ENDPOINT}/${token}`);

            http.success(function() {
                self.authorize(token, callback);
            });

            http.error(function() {
                self.deauthorize(callback);
            });
        }
    }

})();
