module.exports.tasks = 

  wiredep:
    dev:
      src: '<%= settings.dist %>/index.html'
      dependencies: true
      devDependencies: false
      overrides:
        'socket.io-client':
          main: ['socket.io.js']
        'ngDialog':
          main: ['js/ngDialog.js', 'css/ngDialog.css']
        'highcharts':
          main: ['adapters/standalone-framework.js', 'highcharts.js']

  includeSource:
    options:
      basePath: '<%= settings.dist %>/'
      baseUrl: '/'

    includeJS:
      files:
        '<%= settings.dist %>/index.html': '<%= settings.app %>/index.template'
