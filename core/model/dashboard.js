var uuid = require('node-uuid'),
    Promise = require('promise'),
    rangeCheck = require('range_check'),
    ObjectId = require('mongoose').Types.ObjectId,
    modelName = 'Dashboard';

function getUrl() {
    return uuid.v1().replace(/-/g, '');
}

module.exports = function(mongoose, config) {

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
        },
        IPWhitelistPolicy: {
            type: Boolean,
            default: false
        },
        IPAddressRange: Array
    });

    /**
     * Find dashboard by _id
     * @param _id
     * @param authorised {Boolean}
     */
    schema.statics.get = function(_id, authorised) {
        var self = this;
        return new Promise(function (resolve, reject) {
            try {
                var query = { _id: ObjectId(_id) };
                if (!authorised) query.private = { $ne: true };
                query = self.where(query);
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

    schema.methods.isIPinRange = function(IPAddr) {
        var self = this;
        var addressRange = [];
        self.IPAddressRange.forEach(function(range) {
            if (typeof range === 'string') addressRange.push(range);
        });

        var inRange = rangeCheck.inRange(IPAddr, addressRange);
        if (!self.IPWhitelistPolicy) inRange = !inRange;

        if (!inRange) {
            var msg = [
                'IP blocked: ', IPAddr,'. Reason: whitelist = ',
                self.IPWhitelistPolicy.toString(), ', Range = ', addressRange.join(','),
                ', Dashboard = ', self.name
            ].join('');

            config.logger.debug(msg);
        }
        return inRange;
    };

    // Expose getUrl method
    schema.statics.getUrl = getUrl;

    var Dashboard = mongoose.model(modelName, schema);

    return {
        name: modelName,
        model: Dashboard
    };
};

