'use strict';

angular
    .module("teaparty2.dashboard")
    .factory('Dashboard', function($resource) {
        return $resource('/api/dashboard/:name', {name: '@name'}, {
            list: {
                method: 'GET',
                isArray: true,
                url: '/api/dashboards'
            }
        });
    });
