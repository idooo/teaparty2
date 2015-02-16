var h = require('./helpers');

module.exports = {

    getSettings: function (test) {
        var result = h.get('/api/settings');

        test.ok(Array.isArray(result.widgetTypes));
        test.ok(result.isDatabaseConnected);
        test.done();
    }

};