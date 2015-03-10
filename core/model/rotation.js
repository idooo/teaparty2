var uuid = require('node-uuid'),
    Promise = require('promise'),
    ObjectId = require('mongoose').Types.ObjectId,
    abstract = require('./abstract'),
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

    /**
     * Find rotation by _id
     * @param _id
     */
    schema.statics.get = abstract.get(modelName);

    /**
     * Get list of rotations
     * @returns {Promise}
     */
    schema.statics.getRotations = abstract.getList();

    /**
     * Remove rotation by _id
     * @param _id
     * @returns {Promise}
     */
    schema.statics.delete = abstract.delete();

    /**
     * Find rotation by url
     * @param url
     */
    schema.statics.getByUrl = function(url) {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (!url) return reject({ message: "Rotation url not specified" });
            try {
                var query = self.where({url: url});
            }
            catch (err) {
                reject(err);
            }
            query.findOne(function (err, rotation) {
                if (rotation) resolve(rotation);
                else {
                    if (err) reject(err);
                    else reject({ message: "Rotation not found" });
                }
            });
        });
    };

    var Rotation = mongoose.model(modelName, schema);

    return {
        name: modelName,
        model: Rotation
    };
};

