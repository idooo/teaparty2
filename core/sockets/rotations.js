module.exports = function(io, model, config) {

    config.sync = config.sync || {};

    config.sync.rotationUpdate = getSocketBinding('rotation_update');
    config.sync.rotationControl = getSocketBinding('rotation_control');

    function getSocketBinding(emitName) {
        return function(data) {
            try {
                io.sockets.emit(emitName, data);
                config.logger.debug('Socket emit: ' + emitName, JSON.stringify(data));
            }
            catch (e) {
                config.logger.warn('Socket emit error: ' + emitName + ' - web sockets notification failure');
            }
        }
    }

};
