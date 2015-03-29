var uuid = require('node-uuid'),
    Promise = require('promise'),
    ObjectId = require('mongoose').Types.ObjectId,
    abstract = require('./abstract'),
    modelName = 'Widget';

module.exports = function(mongoose, config, model) {

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
     * Push data to widget
     * @param data
     * @returns {Promise}
     */
    schema.methods.pushData = function(data) {
        var self = this;

        function validateAndFormat(data, ref) {
            if (typeof data !== 'object') data = JSON.parse(data);
            if (typeof ref.validate === 'function') {
                if (!ref.validate(data)) {
                    throw "ValidationError";
                }
            }
            if (typeof ref.format === 'function') {
                return ref.format(data);
            }
            return data;
        }

        return new Promise(function (resolve, reject) {
            if (config.widgets[self.type]) {
                try {
                    self.data = validateAndFormat(data, config.widgets[self.type])
                }
                catch (e) {
                    return reject({message: "Widget data validation fail"});
                }
            }
            else {
                self.data = data;
            }

            self.last_update_date = new Date();
            self.save();
            resolve(self);
        });
    };

    /**
     * Delete widget by _id without removing datasource
     * @param _id
     * @returns {Promise}
     */
    schema.statics._simpleDelete = abstract.delete();

    /**
     * Delete widget by _id and its datasource
     * @param _id
     * @returns {Promise}
     */
    schema.statics.delete = function(_id) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var widget;

            self._simpleDelete(_id)
                .then(function (_widget) {
                    widget = _widget;
                    if (!widget.datasource) return resolve(widget);
                    return model.Datasource.delete({_id: ObjectId(widget.datasource)})
                })
                .then(function(datasource) {
                    datasource.deregister();
                    resolve(widget);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    };

    var Widget = mongoose.model(modelName, schema);

    Widget.schema.path('type').validate(function (value) {
        return typeof config.widgets[value] !== 'undefined'
    }, 'Invalid type');

    return {
        name: modelName,
        model: Widget
    };

};

