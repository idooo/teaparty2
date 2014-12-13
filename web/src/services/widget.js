'use strict';

angular.module("app.services")
    .factory('Widget', function($resource) {
        return $resource('/api/dashboard/:dashboard/widget/:type', {
            dashboard: '@dashboard',
            type: '@type'
        });
    });
