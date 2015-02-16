var sanitize = require('./sanitize');

module.exports = {

    ok: function(r, response, keys) {
        if (typeof response === 'undefined') response = {};
        else try {
            response = response.toObject();
        }
        catch (e) { }

        response.status = 'ok';

        response = sanitize(response, keys);

        r.send(200, response);
    },

    fail: function(r, response, code) {
        response = response || {};
        code = code || 404;

        if (response.name === 'MongoError') response = {error: response.err};
        else if (response.name === 'ValidationError') response = {error: response.errors};

        response.status = 'error';
        response.code = code;

        r.send(code, response);
    }

};
