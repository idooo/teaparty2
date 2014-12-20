'use strict';

angular.module('app.directives')
    .directive('adminForm', function(TemplatePath) {

    return {
        restrict: 'EA',
        replace: true,
        scope: {
            isAdmin: '='
        },
        templateUrl: TemplatePath.get('directive', 'admin'),
        controller: function($scope, $element, $attrs, Auth)  {
            Auth.check().success(function() {
                $scope.isAdmin = true;
            });

            $scope.login = function() {
                Auth.auth($scope.username, $scope.password).success(function(data) {
                    console.log(data);
                    $scope.isAdmin = true;
                })
            }
        }
    }
});
