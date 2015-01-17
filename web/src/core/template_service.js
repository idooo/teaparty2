// Helper for templates resolving for components and widgets

angular.module("teaparty2.core")
    .factory('TemplatePath', function () {

    return {
        get: function (path, component) {
            return "widgets/" + path + "/view/" + (component || path) + ".template";
        }
    }
});