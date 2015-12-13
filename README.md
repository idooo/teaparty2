Teaparty 2 dashboard
===========
Simple dashboard written in Node.JS and AngularJS


## Installation

``` bash
  $ [sudo] npm install teaparty2 -g
```
Run Teaparty2 with your shiny config by setting env variable `config` like:

``` bash 
  $ config=my.json teaparty2
```

## Setup
#### Database
Teaparty2 stores all data in the [MongoDB](http://www.mongodb.org/) database. You will need to install it and setup or use one of cloud-based solutions like [MongoLab](https://mongolab.com/) - free plan there is more than enough for dashboard. 

#### Auth
By default there is no auth and everyone can change your dashboards and get access to widgets. Set config property `admin` to `true` and set `admin` credentials (see example below) if you want to restrict dashboards editing.

#### Logging
You can set logging level and also change log file location (default is `teaparty2/logs`). `logging` section is optional.

#### Dark theme
You have to rebuild Teaparty if you want to have a dark theme. See detailed instructions below

#### Example config
Teaparty2 will use default config (with invalid DB credentials) located in `teaparty2/config/` if environmental variable `config` was not set during the launch. Here is the example config file:

``` json
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
    "uri": "mongodb://ds0XXXXX.mongolab.com",
    "port": 10000,
    "db": "teaparty2",
    "username": "admin",
    "password": "admin"
  },
  "logs": {
    "level": "info",
    "file": "/var/log/teaparty/teaparty.log"
  }
}
```

## Update widget data
At the current moment there are two ways to update widgets' data. You can choose one of them during a widget creation: Push and Pull datasources. Each widget has its own requirements to incoming data. Please look at widgets folder and check widget's reference .js to get an example of data can be stored in widget.

### Push

Manually update widget data by using Teaparty2 API

To push data, send post request to `http://<teaparty-url>/api/push/<widget-key>` with a correct data object for this widget's type.

Here is curl example:

``` bash
curl -H "Content-Type: application/json" -X POST -d '{"value": 35}' http://teaparty.local:8080/api/push/62465070-9fc0-11e4-a490-7fb3618741f2
```

Also there is [node-teaparty](https://github.com/idooo/node-teaparty) Node.js helper module that can make life easier.

### Pull

Teaparty2 will pull data from the remote URL via HTTP and update widgets if data was updated. Please note that right now there is no way to modify data on the fly (expecting in v0.8.0) so remote resource must provide data in a way widget can understand it. 


## Browsers support
Normal browsers and IE10+

## Build
Checkout this repo and install everything you need:

```
npm install && bower install
```

Quick build and run develop server: 

```
grunt serve
```

Quick build and run server with [mocked](https://github.com/idooo/teaparty2/tree/master/tools/mocks/) data: 

```
grunt mocked
```
To run API integration tests first you must create a spearate Teaparty config with server port `8081`, the different database credentials and `database.clean` parameter enabled (it will wipe all the collection at the start), example config:

``` json
{
  "server": {
    "port": 8081
  },
  "database": {
    "uri": "mongodb://XXXXXX.mongolab.com",
    "port": XXXXX,
    "db": "teaparty2_test",
    "username": "test",
    "password": "test",
    "clean": true
  }
}
```
Then run this command to start Teaparty server and run tests against: 

``` bash
tools/api_integration_tests.sh <config_path>
```

Build AngularJS application, minimise everything static:

```
grunt build
```

To enable dark theme: rename `web/src/styles/variables.dark.less` to `variables.less` and rebuild an app

```
mv web/src/styles/variables.dark.less web/src/styles/variables.less
grunt build
```

## Creating new widgets

To create a new widget, please read [this post](https://github.com/idooo/teaparty2/wiki/Creating-widgets) in wiki.

## License

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
