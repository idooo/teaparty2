'use strict';

angular.module("app.services")
    .factory('Auth', function($http, localStorageService) {

        var service = {
            token: undefined,
            auth: function(username, password) {
                var http = $http.post('/api/auth', {
                    username: username,
                    password: password
                });

                http.success(function(data) {
                    localStorageService.set('token', data.token);
                    service.token = data.token;
                    service.isAuth = true;
                });

                return http;
            },

            check: function(userToken) {

                if (typeof userToken === 'undefined') {
                    userToken = localStorageService.get('token');
                    if (userToken === null) {
                        service.token = undefined;
                        return;
                    }
                }

                var http = $http.get('/api/auth/' + userToken);

                http.success(function() {
                    service.token = userToken;
                    service.isAuth = true;
                });

                http.error(function() {
                    service.token = undefined;
                    service.isAuth = false;
                });

                return http;
            }
        };

        return service;
    });
