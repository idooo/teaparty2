module.exports = {
    name: 'rag',
    description: '',
    example_data: '[ { "value": 3, "text": "5XX" }, { "value": 12, "text": "4XX" }, { "value": 87, "text": "200 Status Code" } ]',
    validate: function(data) {
        if (Array.isArray(data) && data.length > 0) {
            for (var i=0; i<data.length-1; i++) {
                if (typeof data[i].value === 'undefined' || typeof data[i].text === 'undefined') return false
            }
            return true;
        }
        return false;
    },
    format: function(data) {
        var result = [],
            elements = data.length;

        if (elements > 3) elements = 3;

        for (var i=0; i<=elements-1; i++) {
            var item = {
                text: data[i].text,
                value: 0
            };

            try {
                item.value = parseInt(data[i].value, 10);
            }
            catch (e) {}

            result.push(item);
        }
        return result;
    }
};