(function () {

    angular
        .module('teaparty2.core')
        .service('ModalsService', ModalsService);

    function ModalsService(ngDialog) {

        const NG_DIALOG_DEFAULT_THEME = 'ngdialog-theme-default';
        const NG_DIALOG_WIDE_MODIFIER = 'ngdialog-theme-default--wide';

        var self = this;
        var modals = {
            newDashboard: {
                template: 'new_dashboard.html',
                controller: 'NewDashboardController'
            },
            rotations: {
                template: 'rotations_control.html',
                controller: 'RotationsControlController',
                className: `${NG_DIALOG_DEFAULT_THEME} ${NG_DIALOG_WIDE_MODIFIER}`
            },
            login: {
                template: 'login.html',
                controller: 'LoginController'
            },
            dashboardSettings: {
                template: 'dashboard_settings.html',
                controller: 'DashboardSettingsController'
            },
            newWidget: {
                template: 'new_widget.html',
                controller: 'NewWidgetController'
            }
        };

        self.createModal = createModal;

        init();

        function init() {
            for (let name in modals) {
                self[name] = createModal(modals[name].template, modals[name].controller, modals[name].className);
            }
        }

        /**
         * Create a modal dialog open function
         * @param templateName
         * @param controllerName
         * @param className
         * @returns {Function}
         */
        function createModal(templateName, controllerName, className) {
            var config = {
                template: `views/modal/${templateName}`,
                controller: `${controllerName} as ctrl`
            };

            if (is.not.undefined(className)) config.className = className;

            return function (data) {
                if (is.not.empty(data)) config.data = data;
                ngDialog.open(config);
            };
        }
    }

})();
