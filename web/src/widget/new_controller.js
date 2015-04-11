(function () {

    angular
        .module('teaparty2.widget')
        .controller('NewWidgetController', NewWidgetController);

    function NewWidgetController ($scope, $rootScope, ngDialog, Settings, Widget, Datasource, DashboardWidgetService) {

        var self = this;

        self.availableWidgetTypes = [];
        self.availableDatasourcesTypes = [];
        self.widgetType = undefined;
        self.datasourceType = undefined;
        self.widgetCaption = '';
        self.error = '';

        // Datasource defaults
        self.interval = 60;
        self.isJsonltValid = true;
        self.jsonlt = '';

        self.addWidget = addWidget;

        // PULL datasource related fields
        self.pullURL = '';

        // Get the settings and fill widget types and datasource types arrays
        Settings.get().then(function (settings) {
            self.availableWidgetTypes = settings.widgetTypes;
            self.availableDatasourcesTypes = settings.datasourcesTypes;

            if (self.availableWidgetTypes.length !== 0) self.widgetType = self.availableWidgetTypes[0];
            if (self.availableDatasourcesTypes.length !== 0) self.datasourceType = self.availableDatasourcesTypes[0];
        });

        // Watch JSONLT to validate
        $scope.$watch('ctrl.jsonlt', newValue => validateJSONLT(newValue));

        function addWidget () {
            var widget = new Widget({
                type: self.widgetType,
                caption: self.widgetCaption
            });

            widget.$save(function (createdWidget) {

                if (self.datasourceType !== 'PUSH') createDatasource(widget);

                var promise = DashboardWidgetService.addWidgetToDashboard($scope.ngDialogData.dashboard._id, createdWidget._id);
                promise.then(function () {
                    $rootScope.$broadcast('widgetAddedEvent', {
                        dashboardId: $scope.ngDialogData.dashboard._id
                    });
                    ngDialog.close();
                }, showError);

            }, showError);
        }

        /**
         * Created datasource for the widget and update references
         * @param widget
         */
        function createDatasource (widget) {
            var datasource = new Datasource({
                type: self.datasourceType,
                url: self.pullURL,
                widgetId: widget._id,
                jsonlt: self.jsonlt,
                interval: self.interval
            });

            datasource.$save(function (createdDatasource) {

                Widget.update({
                    widgetId: widget._id,
                    datasource: createdDatasource._id
                });
            });
        }

        function showError (err) {
            self.error = err.data ? err.data.error : {message: 'Server is unavailable'};
        }

        function validateJSONLT () {
            if (self.jsonlt.trim() === '') return self.isJsonltValid = true;

            try { JSON.parse(self.jsonlt) }
            catch (e) { return self.isJsonltValid = false; }

            return self.isJsonltValid = true;
        }
    }

})();
