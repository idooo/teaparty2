(function () {

    angular
        .module('teaparty2.datasource')
        .factory('Datasource', function ($resource) {
            return $resource('/api/datasource',
                {
                    datasourceId: '@datasourceId'
                }
            );
        });

})();
