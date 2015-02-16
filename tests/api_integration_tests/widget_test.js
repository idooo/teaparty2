var h = require('./helpers');

module.exports = {

    newWidget: function (test) {
        var widgetOut1 = h.post('/api/widget', { caption: 'testnewwidget', type: 'text' });
        var widgetOut2 = h.get('/api/widget/' + widgetOut1._id.toString());

        test.equal(widgetOut2.type, 'text');
        test.equal(widgetOut2.caption, "testnewwidget");

        test.equal(widgetOut2.type, widgetOut1.type);
        test.equal(widgetOut2._id.toString(), widgetOut1._id.toString());

        test.done();
    },

    deleteWidget: function (test) {
        var widgetOut1 = h.post('/api/widget', { caption: 'testdeletewidget', type: 'text' });
        h.delete('/api/widget/' + widgetOut1._id.toString());
        var widgetOut2 = h.get('/api/widget/' + widgetOut1._id.toString());

        test.equal(widgetOut2.code, 404);
        test.done();
    },

    updateWidget: function (test) {
        var widgetOut1 = h.post('/api/widget', { caption: 'testupdatewidget1', type: 'text' });
        h.put('/api/widget/' + widgetOut1._id.toString(), {caption: 'testupdatewidget2'});
        var widgetOut2 = h.get('/api/widget/' + widgetOut1._id.toString());

        test.equal(widgetOut2.caption, 'testupdatewidget2');
        test.done();
    }

};