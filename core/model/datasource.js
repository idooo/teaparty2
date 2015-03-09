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
            required: true,
            default: 'PULL'
        },
        widget: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        interval: {
            type: Number,
            default: 10
        }
    });

    /**
     * Find datasource by _id
     * @param _id
     */
    schema.statics.get = function(_id) {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (!_id) return reject({ message: "Datasource ID not specified" });

            try {
                var query = self.where({_id: ObjectId(_id)});
            }
            catch (err) {
                reject(err);
            }
            query.findOne(function (err, datasource) {
                if (datasource) resolve(datasource);
                else {
                    if (err) reject(err);
                    else reject({ message: "Datasource not found" });
                }
            });
        });
    };

    var Datasource = mongoose.model(modelName, schema);

    return {
        name: modelName,
        model: Datasource
    };
};

