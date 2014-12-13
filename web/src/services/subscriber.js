'use strict';

angular.module("app.services")
    .factory('Subscriber', function () {
        return {
            subscribe: function ($scope, callback) {
                $scope.$on('widgetUpdateEvent:' + $scope.widget.key, function(event, data) {
                    $scope.widget.data = data;
                    if (typeof callback === 'function') callback(data);
                });
            }
        }
    });