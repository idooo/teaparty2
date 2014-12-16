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
        widgets: {
            type: Array,
            default: Array
        },
        creation_date: {
            type: Date,
            default: Date.now
        }
    });

    var Rotation = mongoose.model(modelName, schema);

    return {
        name: modelName,
        model: Rotation
    };
};

