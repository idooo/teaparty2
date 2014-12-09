'use strict';

angular.module('teaparty2').factory('mySocket', function (socketFactory) {
  return socketFactory();
});

angular.module('teaparty2').controller('MainCtrl', function(mySocket) {

    var self = this;

    mySocket.emit('event1', 'test');

    console.log('pew controller');
});
