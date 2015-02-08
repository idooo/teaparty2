// Helper for templates resolving for components and widgets

(function () {

    angular
        .module('teaparty2.core')
        .factory('TemplatePath', function () {

            return {
                get: function (path, component = path) {
                    return `widgets/${path}/view/${component}.template`;
                }
            };
        });

})();
