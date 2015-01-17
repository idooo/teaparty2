'use strict';

angular.module("teaparty2.core")
    .factory('Sockets', function (socketFactory) {
        return socketFactory();
    });