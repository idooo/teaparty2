module.exports = {
    name: 'text',
    description: '',
    example_data: '{ "text": "Hello world!" }',
    validate: function(data) {
        return typeof data.text !== 'undefined';
    },
    format: function(data) {
        return {
            text: data.text.toString()
        };
    }
};