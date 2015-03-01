var h = require('./helpers');

module.exports = {

    addWidgetToDashboard: function (test) {
        var r = createWidgetAndDashboard('testaddwidgettodashboard', 'testaddwidgettodashboardwidget');

        // Add widget to dashboard
        var response = h.post(r.url);

        // Get updated dashboard information
        var dashboardOut2 = h.get('/api/dashboard/' + r.dashboard._id.toString());

        test.equal(dashboardOut2.widgets[0]._id.toString(), r.widget._id.toString());
        test.equal(response.caption, r.widget.caption);

        test.done();
    },

    removeWidgetFromDashboard: function (test) {
        var r = createWidgetAndDashboard('testremovewidgettodashboard', 'testremovewidgettodashboardwidget');

        // Add widget to dashboard
        h.post(r.url);

        // Remove widget
        var response = h.delete(r.url);

        // Get updated dashboard information
        var dashboardOut2 = h.get('/api/dashboard/' + r.dashboard._id.toString());

        test.equal(dashboardOut2.widgets.length, 0);
        test.equal(response.status, 'ok');

        test.done();
    },

    updateWidgetPositionInDashboard: function (test) {
        var r = createWidgetAndDashboard('testupdatewidgettodashboard', 'testupdatewidgettodashboardwidget');

        // Add widget to dashboard
        h.post(r.url);

        // Update SIZE and POSITION for widget
        var response = h.post(r.url + '/move', { size: {x:3, y:2}, position: [0, 4]});
        // Get updated dashboard information
        var dashboard = h.get('/api/dashboard/' + r.dashboard._id.toString());

        test.deepEqual(dashboard.widgets[0].size, {x:3, y:2});
        test.deepEqual(dashboard.widgets[0].position, [0, 4]);
        test.equal(response.status, 'ok');

        // Update in two requests for widget and get dashboard
        h.post(r.url + '/move', { size: {x:1, y:3}});
        h.post(r.url + '/move', { position: [2, 1]});
        dashboard = h.get('/api/dashboard/' + r.dashboard._id.toString());

        test.deepEqual(dashboard.widgets[0].size, {x:1, y:3});
        test.deepEqual(dashboard.widgets[0].position, [2, 1]);

        test.done();
    },

    moveWidgetFromOneDashToAnother: function (test) {
        var r = createWidgetAndDashboard('testmove1dashboard1', 'testwidget999');
        var dashboard2 = h.post('/api/dashboard', { name: 'testmove1dashboard2' });

        // Add widget to dashboard 1
        h.post(r.url);

        // move to dashboard 2
        h.post(r.url + '/move/' + dashboard2._id.toString());

        var dashboard1 = h.get('/api/dashboard/' + r.dashboard._id.toString());
        dashboard2 = h.get('/api/dashboard/' + dashboard2._id.toString());

        test.equal(dashboard2.widgets[0]._id.toString(), r.widget._id.toString());
        test.ok(dashboard1.widgets.length === 0);

        test.done();
    }

};

function createWidgetAndDashboard(dashboardName, widgetName) {
    var dashboard = h.post('/api/dashboard', { name: dashboardName });
    var widget = h.post('/api/widget', { caption: widgetName, type: 'text' });
    return {
        dashboard: dashboard,
        widget: widget,
        url: '/api/dashboard/' + dashboard._id.toString() + '/widget/' + widget._id.toString()
    }
}