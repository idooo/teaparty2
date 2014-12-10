
module.exports = function(io) {

    io.sockets.on('connection', function (socket) {
        console.log('connect client');
        //socket.emit('news', { hello: 'world' });
        socket.on('event1', function (data) {
                console.log(data);
        });
    });

};