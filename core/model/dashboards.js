
var modelName = 'Dashboard';

module.exports = function(mongoose) {

    var dashboardSchema = mongoose.Schema({
        name: String
    });

    var Dashboard = mongoose.model(modelName, dashboardSchema);

    return {
        name: modelName,
        model: Dashboard
    };
};

