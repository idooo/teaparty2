(function () {

    angular
        .module('teaparty2.widget')
        .directive('timeout', timeoutDirective);

    function timeoutDirective() {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                value: '@'
            },
            templateUrl: 'rotation/timeout_directive/timeout_directive.template',
            link: link,
            controller: controller
        };
    }

    function link(scope) {

    }

    function controller($scope, $element, $attrs) {

    }

})();
