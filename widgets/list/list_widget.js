module.exports = {
    name: 'list',
    description: '',
    example_data: '[ { "value": 24, "label": "Example" }, { "value": 52.12 } ]',
    validate: function(data) {
        var isValid = false;
        if (Object.prototype.toString.call(data) === '[object Array]') {
            for (var i=0; i<data.length; i++) {
                if (typeof data[i].value === 'undefined') return;
            }
            isValid = true;
        }
        return isValid;
    },
    format: function(data) {
        var formattedArray = [];
        for (var i=0; i<data.length; i++) {
            var obj = {
                value: 0,
                label: ''
            };
            try {
                obj.value = parseFloat(data[i].value);
                if (typeof data[i].label !== 'undefined') obj.label = data[i].label;
            }
            catch (e) {}
            formattedArray.push(obj);
        }
        return data;
    }
};