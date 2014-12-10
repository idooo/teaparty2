
var defaults = ['_id', '__v'];

module.exports = function(obj, fields) {
    fields = fields || defaults;

    fields.forEach(function(fieldName) {
        if (typeof obj[fieldName] !== 'undefined') delete obj[fieldName]
    });

    return obj;
};