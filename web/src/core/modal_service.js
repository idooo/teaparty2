(function () {

    angular
        .module('teaparty2.core')
        .service('ModalService', ModalService);

    function ModalService(ngDialog) {

        var self = this;
        var modals = {
            newDashboard: {
                template: 'dashboard/views/new_dashboard_modal.html',
                controller: 'NewDashboardController'
            },
            rotations: {
                template: 'rotation/views/rotations_modal.html',
                controller: 'RotationsSettingsController'
            },
            login: {
                template: 'core/views/login_modal.html',
                controller: 'LoginController'
            },
            dashboardSettings: {
                template: 'dashboard/views/dashboard_settings_modal.html',
                controller: 'DashboardSettingsController'
            },
            newWidget: {
                template: 'widget/views/new_widget_modal.html',
                controller: 'NewWidgetController'
            },
            widgetSettings: {
                template: 'widget/views/widget_settings_modal.html',
                controller: 'WidgetSettingsController'
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
                template: `${templateName}`,
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
