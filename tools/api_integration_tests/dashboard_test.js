var h = require('./helpers');

module.exports = {

    newDashboard: function (test) {
        var dashboardOut1 = h.post('/api/dashboard', { name: 'testnewdash' });
        var dashboardOut2 = h.get('/api/dashboard/' + dashboardOut1._id.toString());

        test.equal(dashboardOut1.name, dashboardOut2.name);
        test.equal(dashboardOut2.name, "testnewdash");
        test.ok(typeof dashboardOut2._id !== 'undefined');
        test.ok(typeof dashboardOut2.url !== 'undefined');

        test.done();
    },

    getDashboardsList: function (test) {
        var dashNames = ['testgetdashboard1', 'testgetdashboard2'];

        var dashboard1 = h.post('/api/dashboard', { name: dashNames[0] });
        var dashboard2 = h.post('/api/dashboard', { name: dashNames[1] });

        var data = h.get('/api/dashboards');

        var found = 0;
        data.forEach(function(dashboard) {
            if (dashNames.indexOf(dashboard.name) !== -1) found += 1;
        });

        test.equal(found, dashNames.length);

        test.done();
    },

    deleteDashboard: function (test) {
        var dashboard = h.post('/api/dashboard', { name: 'testdeletedashboard' });
        var dashboardslist1 = h.get('/api/dashboards');

        h.delete('/api/dashboard/' + dashboard._id.toString());
        var dashboardslist2 = h.get('/api/dashboards');

        var found = false;
        dashboardslist2.forEach(function(_dashboard) {
            if (dashboard._id.toString() === _dashboard._id.toString()) found = true;
        });

        test.ok(!found);
        test.equal(dashboardslist1.length - 1, dashboardslist2.length);

        test.done();
    },

    getDashboard: function (test) {
        var dashboardOut1 = h.post('/api/dashboard', { name: 'getdashboard' });
        var dashboardOut2 = h.get('/api/dashboard/' + dashboardOut1._id.toString());

        test.equal(dashboardOut1._id.toString(), dashboardOut2._id.toString());
        test.equal(dashboardOut1.name, dashboardOut2.name);
        test.ok(typeof dashboardOut2.widgets !== 'undefined');

        test.done();
    },

    updateDashboard: function (test) {
        var dashboard = h.post('/api/dashboard', { name: 'updatedashboard', 'private': true }),
            url = '/api/dashboard/' + dashboard._id.toString();

        var dashboardOut1 = h.get(url);

        h.put(url, {name: 'updatedashboard2', 'private': false});

        var dashboardOut2 = h.get(url);

        h.put(url, {url: true});

        var dashboardOut3 = h.get(url);

        test.equal(dashboardOut1._id.toString(), dashboardOut3._id.toString());
        test.equal(dashboardOut2.name, 'updatedashboard2');
        test.equal(dashboardOut2.private, false);
        test.notEqual(dashboardOut2.url, dashboardOut3.url);

        test.done();
    }

};