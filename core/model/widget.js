var uuid = require('node-uuid'),
    modelName = 'Widget',
    widgetTypes = ['status', 'text'];

module.exports = function(mongoose) {

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
        return widgetTypes.indexOf(value) !== -1
    }, 'Invalid type');

    return {
        name: modelName,
        model: Widget
    };
};

