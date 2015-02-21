/**
 * Listening Web Sockets, react on emitted events
 * and broadcast Angular events to $rootScope
 */
(function () {

    angular
        .module('teaparty2.core')
        .service('Sockets', function ($rootScope, socketFactory) {

            var self = this;

            // Empty placeholder function to make service init visible outside of this module
            self.init = function() {};
            self.socketFactory = socketFactory();

            self.socketFactory.on('widgets_update', function (data) {
                data.forEach(function (updateObject) {
                    $rootScope.$broadcast(`widgetUpdateEvent:${updateObject._id}`, updateObject.data);
                });
            });

            self.socketFactory.on('rotation_update', function (data) {
                $rootScope.$broadcast(`rotationUpdateEvent:${data._id}`, data);
            });

        });

})();
