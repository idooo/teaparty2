var modelName = 'Dashboard';

module.exports = function(mongoose) {

    var schema = mongoose.Schema({
        name: {
            type: String,
            lowercase: true,
            trim: true,
            required: true,
            unique: true
        },
        url: String,
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

