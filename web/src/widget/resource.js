(function () {

    angular
        .module('teaparty2.widget')
        .factory('Widget', function ($resource) {
            return $resource('/api/widget/:key', { key: '@key' });
        });

})();
