(function () {

    angular
        .module('teaparty2.core')
        .directive('popover', popoverDirective);

    function popoverDirective($compile) {
        return {
            restrict: 'A',
            replace: false,
            scope: {
                items: '=',
                select: '&'
            },
            link: function(scope, element) {
                var incomingSelect = scope.select();

                scope.id = Math.random();
                scope.isPopoverOpened = false;

                scope.closePopover = function() {
                    scope.popoverElement[0].style.display = 'none';
                };

                scope.togglePopover = function() {
                    var mode = (scope.popoverElement[0].style.display === 'flex') ? 'none' : 'flex';
                    scope.popoverElement[0].style.display = mode;
                    return mode;
                };

                scope.selectItem = function(item) {
                    scope.closePopover();
                    if (is.not.undefined(incomingSelect)) incomingSelect(item);
                };

                var template = `
                    <div class="popover">
                        <div class="popover__item"
                             ng-repeat="item in items"
                             ng-click="selectItem(item)">
                            {{item}}
                        </div>
                    </div>`;

                element.after(template);
                scope.popoverElement = element.next();
                scope.closePopover();

                $compile(scope.popoverElement)(scope);
            },
            controller: controller
        };
    }

    function controller($scope, $element, $rootScope) {
        $scope.$on('popoverOpenEvent', function(event, data) {
            if (is.not.undefined(data) && data.id !== $scope.id) {
                $scope.closePopover();
            }
        });

        $element.on('click', function() {
            if ($scope.togglePopover() !== 'none') {
                $rootScope.$broadcast('popoverOpenEvent', {id: $scope.id});
            }
        });
    }

})();
