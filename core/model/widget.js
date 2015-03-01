var uuid = require('node-uuid'),
    Promise = require('promise'),
    ObjectId = require('mongoose').Types.ObjectId,
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
            type: String,
            default: 'push'
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

    var Widget = mongoose.model(modelName, schema);

    Widget.schema.path('type').validate(function (value) {
        return typeof config.widgets[value] !== 'undefined'
    }, 'Invalid type');

    /**
     * Find widget by _id
     * @param _id
     */
    Widget.find = function(_id) {
        var self = this;
        return new Promise(function (resolve, reject) {
            try {
                var query = self.where({_id: ObjectId(_id)});
            }
            catch (err) {
                reject(err);
            }
            query.findOne(function (err, widget) {
                if (widget) resolve(widget);
                else {
                    if (err) reject(err);
                    else reject({ message: "Widget not found" });
                }
            });
        });
    };

    return {
        name: modelName,
        model: Widget
    };
};

