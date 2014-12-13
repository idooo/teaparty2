'use strict';

angular.module("app.services")
    .factory('Dashboard', function($resource) {
        return $resource('/api/dashboard/:name', {name: '@name'}, {
            list: {
                method: 'GET',
                isArray: true,
                url: '/api/dashboards'
            }
        });
    });
