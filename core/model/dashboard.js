var uuid = require('node-uuid'),
    modelName = 'Dashboard';

function getUrl() {
    return uuid.v1().replace(/-/g, '');
}

module.exports = function(mongoose) {

    var schema = mongoose.Schema({
        name: {
            type: String, // TODO: check is not 'rotation'
            lowercase: true,
            trim: true,
            required: true,
            unique: true
        },
        url: {
            type: String,
            default: getUrl
        },
        widgets: Array,
        private: {
            type: Boolean,
            default: false
        },
        creation_date: {
            type: Date,
            default: Date.now
        }
    });

    var Dashboard = mongoose.model(modelName, schema);

    return {
        name: modelName,
        model: Dashboard
    };
};

