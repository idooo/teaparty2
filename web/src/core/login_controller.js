(function () {

    'use strict';

    angular
        .module('teaparty2.core')
        .controller('LoginController', LoginController);

    function LoginController($rootScope, ngDialog, Auth) {

        var self = this;

        self.error = '';

        self.login = function () {
            Auth.auth(self.username, self.password, function (isAuthorised, err) {
                $rootScope.isAuthorised = isAuthorised;
                $rootScope.$broadcast('userAuthEvent');

                if (isAuthorised) ngDialog.close();
                else self.error = err;
            });
        };
    }

})();
