/**
 * This is module communication module between server side and client
 * to send messages about widget data updates via Web Sockets
 * @param io
 * @param model
 * @param config
 */
module.exports = function(io, model, config) {

    var lastCheck = -1,
        inProgress = false;

    io.sockets.on('connection', function (data) {
        config.logger.info('Web sockets client connected, IP:', data.conn.remoteAddress);
    });

    setInterval(function() {
        getDataFromWidgets(function(data) {
            if (data.length) {
                io.sockets.emit('widgets_update', data);
                config.logger.debug("Socket emit: widgets_update", JSON.stringify(data));
            }
        });
    }, 5000);

    function getDataFromWidgets(callback) {
        if (inProgress) return;
        if (!config.database.isConnected) return;

        inProgress = true;

        var query = model.Widget.where({ last_update_date: {$gt: lastCheck }});
        query.find(function (err, widgets) {
            if (err) return config.logger.error("Error getting data from widgets", JSON.stringify(err));

            var clearWidgetsData = [];
            widgets.forEach(function(widget) {
                clearWidgetsData.push({
                    _id: widget._id.toString(),
                    data: widget.data
                })
            });

            if (typeof callback === 'function' && lastCheck !== -1) callback(clearWidgetsData);

            lastCheck = new Date();
            inProgress = false;
        });
    }
};