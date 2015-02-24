module.exports = function(io, model, config) {

    config.sync = config.sync || {};

    config.sync.rotationUpdate = getSocketBinding('rotation_update');
    config.sync.rotationPause = getSocketBinding('rotation_pause');
    config.sync.rotationResume = getSocketBinding('rotation_resume');
    config.sync.rotationChangeDashboard = getSocketBinding('rotation_change_dashboard');

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
