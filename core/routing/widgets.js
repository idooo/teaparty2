var helpers = require('./../helpers'),
    r = helpers.response,
    auth = helpers.auth,
    Promise = require('promise'),
    ObjectId = require('mongoose').Types.ObjectId;

module.exports = function(server, model, config) {

    /**
     * POST: /api/widget/
     * Create new widget
     *
     * AUTH: not authorised users can't create widgets
     *
     * post body:
     *  - type
     *  - caption
     *  - datasource
     *  - settings?
     */
    server.post('/api/widget', function(req, res, next) {

        auth.check(req, res, next, config);
        
        var type = helpers.filter(req.params.type);
        
        var params = {
            type: type,
            caption: helpers.filter(req.params.caption),
            datasource: helpers.filter(req.params.datasource),
            settings: {} 
        }
        
        // TODO: validate setting's type
        if (config.widgets[type] && config.widgets[type].settings) {
            for (var settingName in config.widgets[type].settings) {
                var value = helpers.filter(req.params.settings[settingName]);
                if (value) params.settings[settingName] = value;
            }
        }
        
        var widget = new model.Widget(params);
        widget.save(function (err, widget) {
            if (err) {
                r.fail(res, err, 400);
                return next();
            }
            else {
                r.ok(res, widget);
                return next();
            }
        });

    });

    /**
     * DELETE: /api/widget/:widgetId
     * Delete widget by :widgetId
     */
    server.del('/api/widget/:widgetId', function(req, res, next) {

        auth.check(req, res, next, config);

        model.Widget.delete(req.params.widgetId)
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
     * PUT: /api/widget/:widgetId
     *
     * AUTH: unauthorised users can't change widget settings
     *
     * post body:
     * - caption
     * - datasource
     */
    server.put('/api/widget/:widgetId', function(req, res, next) {

        auth.check(req, res, next, config);

        var paramNames = ['caption', 'datasource', 'src'], // TODO: remove hardcoded src
            updateObj = {};
            
        var query = model.Widget.where({ _id: ObjectId(req.params.widgetId)});

        paramNames.forEach(function(paramName) {
            if (typeof req.params[paramName] !== 'undefined') updateObj[paramName] = req.params[paramName];
        });

        query.findOneAndUpdate(updateObj, function (err, widget) {
            if (widget) r.ok(res);
            else {
                if (err) r.fail(res, err);
                else r.fail(res, { message: "Widget not found" });
            }
            return next();
        });
    });

    /**
     * GET: /api/widget/:widgetId
     */
    server.get('/api/widget/:widgetId', function(req, res, next) {

        try {
            var query = model.Widget.where({_id: ObjectId(req.params.widgetId)});
        }
        catch (err) {
            r.fail(res, { message: "Widget not found" });
            return next();
        }

        query.findOne(function (err, widget) {
            if (widget) {
                var filter;
                if (!auth.isAuthorised(req, config)) filter = ['key'];
                r.ok(res, widget, filter);
            }
            else {
                if (err) r.fail(res, err);
                else r.fail(res, { message: "Widget not found" });
            }
            return next();
        });
    });
};
