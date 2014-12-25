'use strict';

angular.module("app.services")
    .factory('WidgetSubscriber', function () {
        return {
            update: function ($scope, callback) {
                $scope.$on('widgetUpdateEvent:' + $scope.widget.key, function(event, data) {
                    $scope.widget.data = data;
                    if (typeof callback === 'function') callback(data);
                });
            },
            sizeChange: function ($scope, callback) {
                $scope.$on('widgetSizeChangeEvent:' + $scope.widget.key, function(event, data) {
                    if (typeof callback === 'function') callback(data);
                });
            }
        }
    });