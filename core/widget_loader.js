var fs = require('fs'),
    widgets = {},
    widgetsFolder = __dirname + '/../widgets',
    widgetsList = fs.readdirSync(widgetsFolder);

// TODO: add try/catch

widgetsList.forEach(function(widgetName) {

    var widgetPath = widgetsFolder + '/' + widgetName,
        files = fs.readdirSync(widgetPath);

    files.forEach(function(filename) {
        var filepath = widgetPath + '/' + filename;
        if (fs.statSync(filepath).isFile() && filepath.slice(-3) === '.js') {
            var importedWidget = require(filepath);
            widgets[importedWidget.name] = importedWidget;
        }
    });
});

module.exports = widgets;