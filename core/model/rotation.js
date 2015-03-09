var uuid = require('node-uuid'),
    Promise = require('promise'),
    ObjectId = require('mongoose').Types.ObjectId,
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
    schema.statics.get = function(_id) {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (!_id) return reject({ message: "Rotation ID not specified" });
            try {
                var query = self.where({_id: ObjectId(_id)});
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

    /**
     * Get list of rotations
     * @returns {Promise}
     */
    schema.statics.getRotations = function() {
        var self = this;
        return new Promise(function (resolve, reject) {
            var query = self.where();
            query.find(function (err, rotations) {
                if (rotations) resolve(rotations);
                else {
                    if (err) reject(err);
                    else reject([]);
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

