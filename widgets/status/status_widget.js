module.exports = {
    name: 'status',
    description: '',
    example_data: '{status: "up"}',
    validate: function(data) {
        if (typeof data.status !== 'undefined') {
            return (['up', 'down'].indexOf(data.status.toLowerCase()) !== -1);
        }
        return false;
    },
    sanitise: function(data) {
        if (typeof data.status !== 'undefined') {
            return {
                status: data.status.toLowerCase()
            }
        }
        return data;
    }
};