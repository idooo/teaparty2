var helpers = require('./../helpers'),
    r = helpers.response,
    auth = helpers.auth,
    Promise = require('promise'),
    ObjectId = require('mongoose').Types.ObjectId,
    extend = require('util')._extend;

module.exports = function(server, model, config) {

    /**
     * GET: /api/dashboard/:dashboardId
     * Get dashboard by :dashboardId
     *
     * AUTH: not authorised users can't get private=true dashboards
     */
    server.get('/api/dashboard/:dashboardId', function create(req, res, next) {

        var isAuthorised = auth.isAuthorised(req, config),
            dashboard,
            _widgets = {};

        model.Dashboard.get(req.params.dashboardId, isAuthorised)
            .then(function(_dashboard) {
                dashboard = _dashboard;

                if (!isAuthorised && !dashboard.isIPinRange(req.connection.remoteAddress)) {
                    r.fail(res, {message: "IP address was blocked for this dashboard"}, 403);
                    return next();
                }

                dashboard.widgets.forEach(function (w) {
                    _widgets[w._id] = {
                        position: w.position,
                        size: w.size
                    }
                });

                return findWidgets(Object.keys(_widgets));
            })
            .then(function(widgets) {
                var filter;
                if (!auth.isAuthorised(req, config)) filter = ['key'];

                dashboard.widgets = [];

                widgets.forEach(function(item) {
                    dashboard.widgets.push(extend(helpers.sanitize(item, filter), _widgets[item._id]));
                });

                r.ok(res, dashboard);
                return next();
            })
            .catch(function(err) {
                r.fail(res, err);
                return next();
            });

        /**
         * Get list of widgets by their IDs
         * @param ids
         * @returns {Promise}
         */
        function findWidgets(ids) {
            return new Promise(function (resolve, reject) {
                var query = model.Widget.where({ _id: {$in: ids }});
                query.find(function (err, widgets) {
                    if (err) reject(err);
                    else resolve(widgets);
                });
            });
        }
    });

    /**
     * POST: /api/dashboard
     * Create new dashboard
     *
     * AUTH: not authorised users can't create dashboards
     *
     * post body:
     *  - name {string}
     *  - private {boolean}
     */
    server.post('/api/dashboard', function(req, res, next) {

        auth.check(req, res, next, config);

        var dashboard = new model.Dashboard({
            'name': req.params.name,
            'private': req.params.private
        });

        dashboard.save(function (err, data) {
            if (err) {
                var message = "Unknown backend error";
                if (err.code === 11000) message = "Dashboard with this name already exists";
                r.fail(res, {message: message}, 400);
            }
            else r.ok(res, data);

            return next();
        });
    });

    /**
     * DELETE: /api/dashboard/:dashboardId
     * Delete dashboard by name
     *
     * AUTH: not authorised users can't delete dashboards
     */
    server.del('/api/dashboard/:dashboardId', function(req, res, next) {

        auth.check(req, res, next, config);

        model.Dashboard.delete(req.params.dashboardId)
            .then(function() {
                r.ok(res);
                return next();
            })
            .catch(function(err) {
                r.fail(res, err);
                return next();
            });

    });

    /**
     * PUT: /api/dashboard/:dashboardId
     * Change dashboard settings
     *
     * AUTH: not authorised users can't change dashboard settings
     *
     * post body:
     * - name (string)
     * - private (boolean)
     * - columns (number)
     * - url (any value -> url will be regenerated)
     * - IPAddressRange (string)
     */
    server.put('/api/dashboard/:dashboardId', function(req, res, next) {

        auth.check(req, res, next, config);

        var IPAddressRange = 'IPAddressRange';

        var paramNames = ['name', 'private', 'columns', IPAddressRange, 'IPWhitelistPolicy'],
            regenerateUrlName = 'url',
            updateObj = {};

        var query = model.Dashboard.where({ _id: ObjectId(req.params.dashboardId)});

        paramNames.forEach(function(paramName) {
            if (typeof req.params[paramName] !== 'undefined') updateObj[paramName] = req.params[paramName];
        });

        if (typeof req.params[regenerateUrlName] !== 'undefined') {
            updateObj[regenerateUrlName] = model.Dashboard.getUrl()
        }

        // Get IP address range list string and format it to array
        if (typeof updateObj[IPAddressRange] !== 'undefined') {
            if (!Array.isArray(updateObj[IPAddressRange])) {
                updateObj[IPAddressRange] = updateObj[IPAddressRange].split(',').map(function (item) {
                    return item.trim();
                });
            }
            updateObj[IPAddressRange] = updateObj[IPAddressRange].filter(function(item) {
                return item.trim().length > 0;
            })
        }

        query.findOneAndUpdate(updateObj, function (err, dashboard) {
            if (dashboard) r.ok(res, dashboard);
            else {
                if (err) r.fail(res, err);
                else r.fail(res, { message: "Dashboard not found" });
            }
            return next();
        });
    });

    /**
     * GET: /api/dashboards
     * Get the list of dashboards
     *
     * AUTH: not authorised users can't see private=true dashboards in the list
     */
    server.get('/api/dashboards', function(req, res, next) {

        var isAuthorised = auth.isAuthorised(req, config),
            query = {};

        if (!isAuthorised) {
            query.private = { $ne: true }
        }

        query = model.Dashboard.where(query);
        query.find(function (err, dashboards) {
            if (dashboards) {
                var sanitized = [];

                dashboards.forEach(function(_dashboard) {
                    if (isAuthorised || _dashboard.isIPinRange(req.connection.remoteAddress)) {
                        sanitized.push(helpers.sanitize(_dashboard));
                    }
                });

                r.ok(res, sanitized.sort(function(a, b) { return a.name > b.name }));
                return next();
            }
            else {
                if (err) r.fail(res, err);
                else r.fail(res);

                return next();
            }
        });
    });
};