
angular.module('teaparty2.widgets')
    .directive('widgetList', function(TemplatePath) {

    const RESIZE_SCALE_DELAY = 500;

    return {
        restrict: 'E',
        replace: true,
        scope: {
            widget: '=widget'
        },
        templateUrl: TemplatePath.get('list'),
        link: function(scope, element) {
            scope.listElement = Sizzle('.widget-list-container', element[0])[0];
        },
        controller: function($scope, $element, $attrs, $timeout, WidgetSubscriber)  {

            $scope.autoScale = (function () {
                return function(delay) {
                    $timeout(function() {
                        $scope.listElement.style.transform = 'scale(1)';
                        if ($scope.listElement.offsetHeight > $element[0].offsetHeight) {
                            let scaleRatio = $element[0].offsetHeight / $scope.listElement.offsetHeight;
                            $scope.listElement.style.transform = `scale(${scaleRatio})`;
                        }
                    }, delay)
                }
            })();

            WidgetSubscriber.ready($scope, $scope.autoScale);

            WidgetSubscriber.update($scope, $scope.autoScale);

            WidgetSubscriber.sizeChange($scope, function() {
                $scope.autoScale(RESIZE_SCALE_DELAY)
            });
        }
    };
});
