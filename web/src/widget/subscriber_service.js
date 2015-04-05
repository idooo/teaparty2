(function () {

    angular
        .module('teaparty2.widget')
        .service('WidgetSubscriber', WidgetSubscriber);

    function WidgetSubscriber () {

        this.update = function ($scope, callback) {
            $scope.$on(`widgetUpdateEvent:${$scope.widget._id}`, function (event, data) {
                $scope.widget.data = data;
                if (angular.isFunction(callback)) callback(data);
            });
        };

        this.sizeChange = function ($scope, callback) {
            $scope.$on(`widgetSizeChangeEvent:${$scope.widget._id}`, function (event, width, height) {
				if (angular.isFunction(callback)) callback(width, height);
            });
        };

        this.ready = function ($scope, callback) {
			if (angular.isFunction(callback)) $scope.$on('widgetReadyEvent', callback);
        };
    }

})();
