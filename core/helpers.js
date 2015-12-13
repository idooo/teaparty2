var exportObj = {},
    helpers = [
        'auth',
        'response',
        'sanitize'
    ];
    
var RE_FILTER = /[^a-zA-Z0-9\s\#_\-:/\.]+/g;

helpers.forEach(function(helperName) {
    exportObj[helperName] = require('./helpers/' + helperName);
});

exportObj.filter = function (str) {
    if (str === null || str === undefined) return undefined;
    return (str.toString() || '').trim().replace(RE_FILTER, '').replace(/(\s+|\t+)/g, ' ');
}

module.exports = exportObj;