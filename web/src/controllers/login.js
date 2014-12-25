'use strict';

angular
    .module('teaparty2')
    .controller('LoginController', function($rootScope, ngDialog, Auth) {

        var self = this;

        self.login = function() {
            Auth.auth(self.username, self.password).success(function(data) {
                console.log(data);
                $rootScope.isAuthorised = true;
                ngDialog.close();
            })
        }
});
