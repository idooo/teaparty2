var h = require('./helpers');

module.exports = {

    newDatasourceAndGetDatasource: function (test) {
        var res = createWidgetAndDatasource({
            type: 'PULL',
            url: 'http://testurl.com/api/test',
            interval: 72
        }, 'testdatasource1');

        var datasourceOut2 = h.get('/api/datasource/' + res.datasource._id.toString());

        test.equal(datasourceOut2.type, res.datasource.type);
        test.equal(datasourceOut2.interval, 72);
        test.equal(datasourceOut2.url, 'http://testurl.com/api/test');

        test.done();
    },

    JSONLT: function (test) {
        var res = createWidgetAndDatasource({
            type: 'PULL',
            url: 'http://testurl.com/api/test',
            jsonlt: '{"invalid"}'
        }, 'testdatasource1');

        var datasourceOut1 = h.get('/api/datasource/' + res.datasource._id.toString());

        test.ok(typeof datasourceOut1.jsonlt === 'undefined');

        res = createWidgetAndDatasource({
            type: 'PULL',
            url: 'http://testurl.com/api/test',
            jsonlt: '{"testValue": 124}'
        }, 'testdatasource1');

        var datasourceOut2 = h.get('/api/datasource/' + res.datasource._id.toString());

        test.equal(datasourceOut2.jsonlt.testValue, 124);

        test.done();
    },

    getListOfDatasources: function (test) {

        var urls = ['getListOfDatasources1', 'getListOfDatasources2', 'getListOfDatasources3'];

        var res1 = createWidgetAndDatasource({
            type: 'PULL',
            url: urls[0]
        }, 'testdatasource1getList');

        var res2 = createWidgetAndDatasource({
            type: 'PULL',
            url: urls[1]
        }, 'testdatasource2getList');

        var res3 = createWidgetAndDatasource({
            type: 'PULL',
            url: urls[2]
        }, 'testdatasource3getList');

        var result = h.get('/api/datasources');

        var found = 0;
        result.forEach(function(i) {
            if (urls.indexOf(i.url) !== -1) found += 1;
        });

        test.ok(result.length > 3);
        test.equal(found, 3);
        test.done();
    },

    removeDatasource: function (test) {
        var url = 'http://testurl.com/api/removeDatasource';
        var res = createWidgetAndDatasource({
            type: 'PULL',
            url: url
        }, 'testdatasourceRemoveDatasource');

        h.delete('/api/datasource/' + res.datasource._id.toString());
        var wrong = h.delete('/api/datasource/' + res.datasource._id.toString());

        var result = h.get('/api/datasources');

        var found = false;
        result.forEach(function(i) {
            if (url === i.url) found = true;
        });

        test.ok(!found);
        test.equals(wrong.code, 404);
        test.done();
    }
};

function createWidgetAndDatasource(datasourceData, widgetName) {
    var widget = h.post('/api/widget', { caption: widgetName, type: 'text' });
    datasourceData.widgetId = widget._id.toString();
    var datasource = h.post('/api/datasource', datasourceData);
    return {
        datasource: datasource,
        widget: widget
    }
}

