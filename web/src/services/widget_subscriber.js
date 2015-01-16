'use strict';

angular.module("app.services")
    .service('WidgetSubscriber', function () {

        this.update = function($scope, callback) {
            $scope.$on('widgetUpdateEvent:' + $scope.widget.key, function(event, data) {
                $scope.widget.data = data;
                if (typeof callback === 'function') callback(data);
            });
        };

        this.sizeChange = function($scope, callback) {
            $scope.$on('widgetSizeChangeEvent:' + $scope.widget.key, function(event, width, height) {
                if (typeof callback === 'function') callback(width, height);
            });
        };

    });
