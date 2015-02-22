var h = require('./helpers');

module.exports = {

    testPushData: function (test) {
        var widgetOut1 = h.post('/api/widget', { caption: 'testpushdata', type: 'status' });
        widgetOut1 = h.get('/api/widget/' + widgetOut1._id.toString());

        h.post('/api/push/' + widgetOut1.key, { status: 'up' });

        var widgetOut2 = h.get('/api/widget/' + widgetOut1._id.toString());

        test.equal(widgetOut2.data.status, 'up');
        test.done();
    }


};