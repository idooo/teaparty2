module.exports = function(io, model, config) {

    var lastCheck = -1,
        inProgress = false;

    io.sockets.on('connection', function () {
        console.log('client connected');
    });

    setInterval(function() {
        getDataFromWidgets(function(data) {
            if (data.length) io.sockets.emit('update_widgets', data);
        });
    }, 5000);

    function getDataFromWidgets(callback) {
        if (inProgress) return;
        if (!config.database.isConnected) return;

        inProgress = true;

        var query = model.Widget.where({ last_update_date: {$gt: lastCheck }});
        query.find(function (err, widgets) {
            if (err) return console.log(err);

            var clearWidgetsData = [];
            widgets.forEach(function(widget) {
                clearWidgetsData.push({
                    key: widget.key,
                    data: widget.data
                })
            });
            console.log(clearWidgetsData);

            lastCheck = new Date();
            inProgress = false;

            if (typeof callback === 'function') callback(clearWidgetsData);
        });
    }

};