var uuid = require('node-uuid'),
    modelName = 'Rotation';

function getUrl() {
    return uuid.v1().replace(/-/g, '');
}

module.exports = function(mongoose) {

    var schema = mongoose.Schema({
        url: {
            type: String,
            default: getUrl
        },
        dashboards: {
            type: Array,
            default: Array
        },
        name: {
            type: String,
            default: ""
        },
        creation_date: {
            type: Date,
            default: Date.now
        }
    });

    // Expose getUrl method
    schema.statics.getUrl = getUrl;

    var Rotation = mongoose.model(modelName, schema);

    return {
        name: modelName,
        model: Rotation
    };
};

