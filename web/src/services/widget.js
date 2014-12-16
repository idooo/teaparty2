'use strict';

angular.module("app.services")
    .factory('Widget', function($resource) {
        return $resource('/api/dashboard/:dashboard/widget/:key', {
            dashboard: '@dashboard',
            key: '@key'
        }, {
            update: {
                method:'PUT'
            }
        });
    });
