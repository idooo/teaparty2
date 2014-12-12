'use strict';

angular.module("app.services")
    .factory('Sockets', function (socketFactory) {
        return socketFactory();
    });