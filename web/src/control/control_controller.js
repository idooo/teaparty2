(function () {

    angular
        .module('teaparty2.control')
        .controller('ControlController', controlController);

    function controlController(Rotation, RotationControlService) {

        var self = this;

        self.rotations = [];
        self.dashboards = [];
        self.selectedRotation = undefined;

        self.pauseRotation = RotationControlService.pauseRotation;
        self.resumeRotation = RotationControlService.resumeRotation;
        self.changeDashboard = RotationControlService.changeDashboard;

        init();

        function init() {

            // Load rotations and slightly format them to display easily
            Rotation.list().$promise.then(function (rotations) {
                self.rotations = rotations.map(function (rotation) {
                    rotation.label = rotation.name || rotation.url;
                    return rotation;
                });

                // Select first rotation
                if (is.not.empty(self.rotations)) self.selectedRotation = self.rotations[0];
            });
        }
    }

})();
