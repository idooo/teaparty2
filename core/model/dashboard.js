var uuid = require('node-uuid'),
    Promise = require('promise'),
    rangeCheck = require('range_check'),
    ObjectId = require('mongoose').Types.ObjectId,
    abstract = require('./abstract'),
    modelName = 'Dashboard';

function getUrl() {
    return uuid.v1().replace(/-/g, '');
}

module.exports = function(mongoose, config, models) {

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
     * @returns {Promise}
     */
    schema.statics.get = abstract.get(modelName, true, {'private': { $ne: true }});

    /**
     * Get list of dashboards by IDs
     * @param ids {Array}
     * @returns {Promise}
     */
    schema.statics.getDashboards = abstract.getList();

    /**
     * Delete dashboard by _id without removing widgets
     * @param _id
     * @returns {Promise}
     */
    schema.statics._simpleDelete = abstract.delete();

    /**
     * Delete dashboard by _id and its widgets
     * @param _id
     * @returns {Promise}
     */
    schema.statics.delete = function(_id) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var dashboard;

            self._simpleDelete(_id)
                .then(function (_dashboard) {
                    dashboard = _dashboard;

                    if (dashboard.widgets.length === 0) return resolve(dashboard);

                    // Delete all the widgets
                    var widgetsIDs = [];
                    dashboard.widgets.forEach(function(widget) {
                        widgetsIDs.push(widget._id)
                    });
                    return Promise.all(widgetsIDs.map(function(_id) {
                        return models.Widget.delete(_id);
                    }));
                })
                .then(function() {
                    resolve(dashboard);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    };

    /**
     * Is IP address in dashboard's IP range settings
     * @param IPAddr
     * @returns {Boolean}
     */
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

