'use strict';

angular.module('teaparty2.widgets')
    .directive('widgetIframe', function(TemplatePath) {

    return {
        restrict: 'E',
        replace: true,
        require: '^widgetContainer',
        scope: {
            widget: '=widget'
        },
        templateUrl: TemplatePath.get('iframe'),
        controller: function($scope, $sce)  {
            $scope.getIframeSrc = getIframeSrc;
            
            function getIframeSrc () {
                if (!$scope.widget || !$scope.widget.settings) return '';
                return $sce.trustAsResourceUrl($scope.widget.settings.src);
            }
        }
    }
});
