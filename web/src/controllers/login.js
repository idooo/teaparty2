'use strict';

angular
    .module('teaparty2')
    .controller('LoginController', function($rootScope, ngDialog, Auth) {

        var self = this;

        self.login = function() {
            Auth.auth(self.username, self.password, function(isAuthorised) {
                $rootScope.isAuthorised = isAuthorised;
                $rootScope.$broadcast('userAuthEvent');
                ngDialog.close();
            })
        }
});
