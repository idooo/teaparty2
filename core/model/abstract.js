
var Promise = require('promise'),
    ObjectId = require('mongoose').Types.ObjectId,
    extend = require('util')._extend;

module.exports = {

    /**
     * Generate the 'get' function with promises for scheme
     * @param modelName
     * @param checkAuth
     * @param failedCheckObject
     * @returns {Function}
     */
    get: function(modelName, checkAuth, failedCheckObject) {

        return function(_id, authorised) {
            var self = this;
            return new Promise(function (resolve, reject) {
                if (!_id) return reject({message: modelName + " ID not specified"});

                try {
                    var query = { _id: ObjectId(_id) };
                    if (typeof authorised !== 'undefined' && !authorised && checkAuth) {
                        query = extend(query, failedCheckObject);
                    }
                    query = self.where(query);
                }
                catch (err) {
                    reject(err);
                }
                query.findOne(function (err, object) {
                    if (object) resolve(object);
                    else {
                        if (err) reject(err);
                        else reject({message: modelName + " not found"});
                    }
                });
            });
        }
    },

    /**
     * Generate the 'get collection' function with promises for scheme
     * @returns {Function}
     */
    getList: function() {

        return function(ids) {
            var self = this;
            return new Promise(function (resolve, reject) {
                var query = {};
                if (typeof ids !== 'undefined') query = { _id: {$in: ids }};

                query = self.where(query);
                query.find(function (err, objects) {
                    if (objects) resolve(objects);
                    else {
                        if (err) reject(err);
                        else reject([]);
                    }
                });
            });
        };
    },

    /**
     * Generate the 'delete' function with promises for scheme
     * @returns {Function}
     */
    delete: function() {
        return function(_id) {
            var self = this;
            return new Promise(function (resolve, reject) {
                try {
                    var query = self.where({_id: (typeof _id === 'string') ? ObjectId(_id): _id});
                }
                catch (err) {
                    reject(err);
                }
                query.findOneAndRemove(function (err, data) {
                    if (data === null) reject({message: "Object with that _id doesn't exist"});
                    if (err) reject(err);
                    else resolve(data);
                });
            });
        }
    }

};