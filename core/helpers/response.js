
var sanitize = require('./sanitize');

module.exports = {

    ok: function(r, response) {
        if (typeof response === 'undefined') response = {};
        else response = response.toObject();

        response.status = 'ok';

        response = sanitize(response);

        r.send(200, response);
    },

    fail: function(r, response, code) {
        response = response || {};
        code = code || 404;

        if (response.name === 'MongoError') response = {error: response.err};
        else if (response.name === 'ValidationError') response = {error: response.errors};

        response.status = 'error';
        response.code = code;

        console.log(response);

        r.send(code, response);
    }

};
