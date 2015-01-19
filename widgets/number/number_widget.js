module.exports = {
    name: 'number',
    description: '',
    example_data: '{ "value": 35 }',
    validate: function(data) {
        return typeof data.value !== 'undefined';
    },
    format: function(data) {
        return {
            value: data.value
        };
    }
};