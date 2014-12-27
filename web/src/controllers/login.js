'use strict';

angular
    .module('teaparty2')
    .controller('LoginController', function($rootScope, ngDialog, Auth) {

        var self = this;

        self.login = function() {
            Auth.auth(self.username, self.password, function(isAuthorised, err) {
                $rootScope.isAuthorised = isAuthorised;
                $rootScope.$broadcast('userAuthEvent');

                if (isAuthorised) {
                    ngDialog.close();
                }
                else {
                    self.error = err;
                }
            })
        }
});
