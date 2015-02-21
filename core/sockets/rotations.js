module.exports = function(io, model, config) {

    config.sync = config.sync || {};

    config.sync.rotationWasChanged = rotationWasChanged;

    function rotationWasChanged(data) {
        io.sockets.emit('rotation_update', data);
        config.logger.debug("Socket emit: rotation_update", JSON.stringify(data));
    }

};
