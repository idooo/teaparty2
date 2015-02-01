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
Teaparty2 stores all data in the [MongoDB](http://www.mongodb.org/) database. You will need to install it and setup it or you can use one of Cloud-based solutions like [MongoLab](https://mongolab.com/) - free plan there is more than enough for dashboard. 

#### Auth
By default there is no auth and everyone can change your dashboards and get access to widgets. Set config property `admin` to `false` and set `admin` credentials (see example below) if you want to restrict dashboards editing.

#### Logging
You can set logging level and also change log file location (default is `teaparty2/logs`). `logging` section is optional.

#### Example config
Teaparty2 will use default config (with invalid DB credentials) located in `teaparty2/config/` if environmental variable `config` was not set during the launch. Here is the example config file:

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
## Browsers support
Normal browsers and IE10+

## Build
Quick build and run develop server: 

```
grunt serve
```

Build AngularJS application, minimise everything static:

```
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
