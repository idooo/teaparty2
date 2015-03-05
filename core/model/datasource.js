var modelName = 'Datasource';

module.exports = function(mongoose, config) {

    var schema = mongoose.Schema({
        url: {
            type: String,
            trim: true,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    });

    var Datasource = mongoose.model(modelName, schema);

    return {
        name: modelName,
        model: Datasource
    };
};

