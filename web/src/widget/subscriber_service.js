(function () {
    'use strict';

    angular
        .module('teaparty2.widget')
        .service('WidgetSubscriber', WidgetSubscriber);

    function WidgetSubscriber() {

        this.update = function ($scope, callback) {
            $scope.$on('widgetUpdateEvent:' + $scope.widget.key, function (event, data) {
                $scope.widget.data = data;
                if (typeof callback === 'function') callback(data);
            });
        };

        this.sizeChange = function ($scope, callback) {
            $scope.$on('widgetSizeChangeEvent:' + $scope.widget.key, function (event, width, height) {
                if (typeof callback === 'function') callback(width, height);
            });
        };

        this.ready = function ($scope, callback) {
            if (typeof callback === 'function') $scope.$on('widgetReadyEvent', callback);
        };
    }

})();
