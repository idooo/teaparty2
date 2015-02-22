var h = require('./helpers');

module.exports = {

    createRotationAndGetRotation: function (test) {
        var rotationOut1 = h.post('/api/rotation');
        var rotationOut2 = h.get('/api/rotation/' + rotationOut1.url);

        test.equal(rotationOut2._id, rotationOut1._id);
        test.equal(rotationOut2.url, rotationOut1.url);

        test.done();
    },

    changeRotationSettings: function (test) {
        var rotationOut1 = h.post('/api/rotation');
        var rotationOut2 = h.get('/api/rotation/' + rotationOut1.url);

        var r = h.put('/api/rotation/' + rotationOut2._id, {
            name: 'changeRotationSettings',
            url: true
        });

        var rotationOut3 = h.get('/api/rotation/' + r.url);
        test.equal(rotationOut3.name, 'changeRotationSettings');
        test.notEqual(rotationOut3.url, rotationOut2.url);

        test.done();
    },

    getRotations: function (test) {
        var rotations1 = h.get('/api/rotations');
        var rotationOut1 = h.post('/api/rotation');
        var rotationOut2 = h.post('/api/rotation');
        var rotations2 = h.get('/api/rotations');

        var found = 0;
        rotations2.forEach(function(r) {
            if (r.url === rotationOut1.url || r.url === rotationOut2.url) found += 1;
        });

        test.equal(rotations2.length - rotations1.length, 2);
        test.ok(found, 2);

        test.done();
    },

    deleteRotation: function (test) {
        var rotationOut1 = h.post('/api/rotation');
        var rotationOut2 = h.get('/api/rotation/' + rotationOut1.url);

        h.delete('/api/rotation/' + rotationOut1._id);

        var rotationOut3 = h.get('/api/rotation/' + rotationOut1.url);

        test.equal(rotationOut3.code, 404);

        test.done();
    },

    addDashboardToRotation: function (test) {
        // Create dashboard and rotation
        var rotationOut1 = h.post('/api/rotation');
        var dashboardOut1 = h.post('/api/dashboard', { name: 'testaddtorotation' });

        // Add dashboard to rotation
        h.post('/api/rotation/' + rotationOut1._id + '/' + dashboardOut1._id);

        var rotationOut2 = h.get('/api/rotation/' + rotationOut1.url);

        test.equal(rotationOut2.dashboards.length, 1);
        test.equal(rotationOut2.dashboards[0].name, dashboardOut1.name);
        test.equal(rotationOut2.dashboards[0]._id, dashboardOut1._id);

        test.done();
    },

    updateDashboardInRotation: function (test) {
        // Create dashboard and rotation
        var rotationOut1 = h.post('/api/rotation');
        var dashboardOut1 = h.post('/api/dashboard', { name: 'testupdatedashinrotation' });

        // Add dashboard to rotation
        h.post('/api/rotation/' + rotationOut1._id + '/' + dashboardOut1._id);

        // Update dashboard timeout
        h.put('/api/rotation/' + rotationOut1._id + '/' + dashboardOut1._id, {
            timeout: 913
        });

        var rotationOut2 = h.get('/api/rotation/' + rotationOut1.url);

        test.equal(rotationOut2.dashboards[0].timeout, 913);

        test.done();
    },

    deleteDashboardFromRotation: function (test) {
        // Create dashboards and rotation
        var rotationOut1 = h.post('/api/rotation');
        var dashboard1 = h.post('/api/dashboard', { name: 'testdeleterotation1' });
        var dashboard2 = h.post('/api/dashboard', { name: 'testdeleterotation2' });

        // Add dashboards to rotation
        h.post('/api/rotation/' + rotationOut1._id + '/' + dashboard1._id);
        h.post('/api/rotation/' + rotationOut1._id + '/' + dashboard2._id);

        // Delete dashboard timeout
        h.delete('/api/rotation/' + rotationOut1._id + '/' + dashboard1._id);

        var rotationOut2 = h.get('/api/rotation/' + rotationOut1.url);

        test.equal(rotationOut2.dashboards.length, 1);
        test.equal(rotationOut2.dashboards[0]._id, dashboard2._id);

        test.done();
    }

};