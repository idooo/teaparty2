var uuid = require('node-uuid'),
    Promise = require('promise'),
    ObjectId = require('mongoose').Types.ObjectId,
    abstract = require('./abstract'),
    modelName = 'Widget';

module.exports = function(mongoose, config) {

    var schema = mongoose.Schema({
        key: {
            type: String,
            default: uuid.v1
        },
        type: String,
        caption: {
            type: String,
            default: 'New Widget'
        },
        datasource: {
            type: mongoose.Schema.Types.ObjectId
        },
        settings: {
            type: Object,
            default: Object
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            default: {empty: true}
        },
        creation_date: {
            type: Date,
            default: Date.now
        },
        last_update_date: {
            type: Date,
            default: 0
        }
    });

    /**
     * Find widget by _id
     * @param _id
     */
    schema.statics.get = abstract.get(modelName);

    /**
     * Add widget reference to dashboard
     * @param dashboard
     * @returns {Promise}
     */
    schema.methods.addToDashboard = function(dashboard) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var widget_data = {
                size: { "x": 1, "y": 1 },
                position: [0, 0],
                _id: self._id
            };

            dashboard.widgets.push(widget_data);
            dashboard.save(function (err) {
                if (err) reject(err);
                else resolve(self);
            });
        });
    };

    /**
     * Remove widget reference from the dashboard
     * @param dashboard
     * @returns {Promise}
     */
    schema.methods.removeFromDashboard = function(dashboard) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var _id = self._id.toString();

            for (var i = 0; i < dashboard.widgets.length; i++) {
                if (dashboard.widgets[i]._id.toString() === _id) {
                    dashboard.widgets.splice(i, 1);
                }
            }

            dashboard.save(function (err) {
                if (err) reject(err);
                else resolve(self);
            });
        });
    };

    /**
     * Remove widget by _id
     * @param _id
     * @returns {Promise}
     */
    schema.statics.delete = abstract.delete();

    var Widget = mongoose.model(modelName, schema);

    Widget.schema.path('type').validate(function (value) {
        return typeof config.widgets[value] !== 'undefined'
    }, 'Invalid type');

    return {
        name: modelName,
        model: Widget
    };

};

