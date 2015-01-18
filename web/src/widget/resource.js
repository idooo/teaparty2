(function () {

    'use strict';

    angular
        .module('teaparty2.widget')
        .factory('Widget', function ($resource) {
            return $resource('/api/dashboard/:dashboard/widget/:key', {
                dashboard: '@dashboard',
                key: '@key'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        });

})();
