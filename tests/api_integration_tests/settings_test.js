var h = require('./helpers');

module.exports = {

    getSettings: function (test) {
        var result = h.get('/api/settings');

        test.ok(Array.isArray(result.widgetTypes));
        test.ok(result.isDatabaseConnected);

        test.ok(result.datasourcesTypes.length > 0);
        test.ok(result.datasourcesTypes.indexOf('PULL') !== -1);

        test.done();
    }

};