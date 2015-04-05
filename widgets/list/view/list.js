
angular.module('teaparty2.widgets')
    .directive('widgetList', function(TemplatePath, WidgetSubscriber) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            widget: '=widget'
        },
        templateUrl: TemplatePath.get('list'),
        link: function(scope) {
            WidgetSubscriber.update(scope);
        }
    };
});
