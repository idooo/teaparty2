var modelName = 'Datasource',
    abstract = require('./abstract');

module.exports = function(mongoose, config) {

    var schema = mongoose.Schema({
        url: {
            type: String,
            trim: true,
            required: true
        },
        type: {
            type: String,
            required: true,
            default: 'PULL'
        },
		jsonlt: {
			type: Object
		},
        widget: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        creation_date: {
            type: Date,
            default: Date.now
        },
        raw_data: {
            type: String
        },
        last_update_date: {
            type: Date
        },
        last_update_status: {
            type: String
        },
        last_error: {
            type: String
        },
        interval: {
            type: Number,
            default: 60
        }
    });

    /**
     * Find datasource by _id
     * @param _id
     * @returns {Promise}
     */
    schema.statics.get = abstract.get(modelName);

    /**
     * Get list of datasources
     * @returns {Promise}
     */
    schema.statics.getDatasources = abstract.getList();

    /**
     * Remove rotation by _id
     * @param _id
     * @returns {Promise}
     */
    schema.statics.delete = abstract.delete(modelName);

    schema.methods.register = function() {
        config.datasources[this.type].registerDatasource(this);
    };

    schema.methods.deregister = function() {
        config.datasources[this.type].deregisterDatasource(this);
    };

    var Datasource = mongoose.model(modelName, schema);

    return {
        name: modelName,
        model: Datasource
    };
};

