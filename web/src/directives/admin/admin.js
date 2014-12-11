'use strict';

angular.module('app.widgets')
    .directive('adminForm', function(TemplatePath) {

    return {
        restrict: 'EA',
        replace: true,
        scope: {},
        templateUrl: TemplatePath.get('directive', 'admin'),
        link: function(scope, element) {
            scope.isAdmin = false;
        },
        controller: function($scope, $element, $attrs, Auth)  {
            Auth.check().success(function(){
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
