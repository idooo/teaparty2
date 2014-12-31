Teaparty 2 dashboard
===========

### Configuration
```
{
  "auth": false,
  "admin": {
    "username": "admin",
    "password": "admin"
  },
  "server": {
    "port": 8080
  },
  "database": {
    "uri": "mongodb://ds061620.mongolab.com",
    "port": 61620,
    "db": "teaparty2",
    "username": "admin",
    "password": "admin"
  }
}
```

### Creating widgets

You can find widgets in `/widgets` directory. To create new widget simply create new folder there like `/widgets/newWidget` and add these files there:

#### <widget_dir>/anyname.js
This file (you can pick any name) will describe backend for your widget. You need to export JavaScript object with some important fields there. Here is the example:

```
module.exports = {
    name: ‘random-widget’,
    description: ‘blah blah blah’,
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
```

##### name
Code name for your widget. This field is required. Please do not use *widget* word as part of your widget name. This name will be used in AngularJS directive later.

##### description, example_data
Optional. Description and example data

##### validate - function(Object data): boolean
Optional. Validator for incoming data for your widget 

##### format - function(Object data): data
Optional. Custom formatters for data for your widget. The output of this function will be saved to database. Please strip all redundant data to keep database more compact.

#### <widget_dir>/view/anyname.template
Template that will be used in your AngularJS widget directive. All widget data you will find in `{{widget}}` object. For example widget data you can find in `{{widget.data}}`. Inspect this object to see all the properties you can show to user.

#### <widget_dir>/view/anyname.less
Styles for your widget. Use `@import "../../imports";` to get access to glocal application style variables and mixins

#### <widget_dir>/view/anyname.js
This is AngularJS directive that will display your widget. Example:

```
angular.module('app.widgets')
    .directive('widgetList', function(TemplatePath) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            widget: '=widget'
        },
        templateUrl: TemplatePath.get('widget', 'list'),
        controller: function($scope, $element, $attrs, WidgetSubscriber)  {
            WidgetSubscriber.update($scope);
        }
    }
});
```

The name of your directive **must follow pattern: widget&lt;WidgetName&gt;** like `widgetRandomWidget` if we use name `random-widget` from the example above. 

##### restrict, replace and scope 
Should always be defined in this way: 

```
	restrict: 'E',
    replace: true,
    scope: {
    	widget: '=widget'
    },
```

##### templateUrl
You can use `TemplatePath` helper to generate paths for your templates. It works something like this:

```
function (type, path, component) {
	return "widgets/" + path + "/view/" + (component || path) + ".template";
}
``` 

##### controller
If you want to enable live updates for your widget via sockets (I think you want), you need to inject `WidgetSubscriber` service and subscribe your widget to updates: `WidgetSubscriber.update($scope);`. All data will be copied to `$scope.data`.

`WidgetSubscriber` has two methods you can use:

###### WidgetSubscriber.update($scope, [callback])
Where `callback` is `function(data) {}` that will be executed when your widget will receive the data update

###### WidgetSubscriber.sizeChange($scope, [callback])
Where `callback` is `function() {}` that will be executed when size was changed for your widget

#### Installation
You will need to rebuild application using `grunt build` (your directive will be added to app’s code) and also restart the application (backend application load widgets references at the start of the application)

### License

##### The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
