var exportObj = {},
    helpers = [
        'auth',
        'response',
        'sanitize'
    ];

helpers.forEach(function(helperName) {
    exportObj[helperName] = require('./helpers/' + helperName);
});

module.exports = exportObj;