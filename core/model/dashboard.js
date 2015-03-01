var uuid = require('node-uuid'),
    Promise = require('promise'),
    ObjectId = require('mongoose').Types.ObjectId,
    modelName = 'Dashboard';

function getUrl() {
    return uuid.v1().replace(/-/g, '');
}

module.exports = function(mongoose) {

    var schema = mongoose.Schema({
        name: {
            type: String,
            lowercase: true,
            trim: true,
            required: true,
            unique: true
        },
        url: {
            type: String,
            default: getUrl
        },
        columns: {
            type: Number,
            default: 10
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

    /**
     * Find dashboard by _id
     * @param _id
     */
    schema.statics.get = function(_id) {
        var self = this;
        return new Promise(function (resolve, reject) {
            try {
                var query  = self.where({ _id: ObjectId(_id) });
            }
            catch (err) {
                reject(err);
            }
            query.findOne(function (err, dashboard) {
                if (dashboard) resolve(dashboard);
                else {
                    if (err) reject(err);
                    else reject({ message: "Dashboard not found" });
                }
            });
        });
    };

    // Expose getUrl method
    schema.statics.getUrl = getUrl;

    var Dashboard = mongoose.model(modelName, schema);

    return {
        name: modelName,
        model: Dashboard
    };
};

