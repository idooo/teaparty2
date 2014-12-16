module.exports = (grunt) ->

  ##############################################################
  # Dependencies
  ###############################################################

  require('load-grunt-tasks')(grunt)
  require('time-grunt')(grunt)

  ##############################################################
  # Configuration
  ##############################################################

  grunt.initConfig

  # bootstrapping

    settings:
      app: 'web/src'
      vendor: 'web/vendor'
      widgets: 'widgets'
      dist: 'web/dist'
      tmp: '.tmp'

  # wiredep

    wiredep:
      dev:
        src: '<%= settings.dist %>/index.html'
        dependencies: true
        devDependencies: false
        overrides:
          'socket.io-client':
            main: ['socket.io.js']
          'highcharts':
            main: ['adapters/standalone-framework.js', 'highcharts.js']

  # clean

    clean:
      default:
        files: [
          {
            dot: true
            src: [
              '<%= settings.dist %>/*'
              '!<%= settings.dist %>/.git*'
            ]
          }
        ]
      tmp: '.tmp/**/*.*'

  # less

    less:
      default:
        options:
          yuicompress: true
        files:
          "<%= settings.dist %>/styles/widgets.css": "<%= settings.widgets %>/**/*.less"
          "<%= settings.dist %>/styles/main.css": "<%= settings.app %>/styles/index.less"
          "<%= settings.dist %>/styles/vendor.css": "<%= settings.vendor %>/**/*.less"

  # ngmin

    ngAnnotate:
      build:
        files:
          '<%= settings.dist %>/scripts/app.js': [
            "<%= settings.app %>/app.js",
            "<%= settings.app %>/**/*.js",
            "<%= settings.widgets %>/**/view/*.js",
          ]
      vendor:
        files:
          '<%= settings.dist %>/scripts/vendor.js': [
            "<%= settings.vendor %>/**/*.js",
          ]

    copy:
      distStatic:
        files: [
          {
            expand: true
            dot: true
            cwd: "<%= settings.app %>"
            dest: "<%= settings.dist %>"
            src: [
              "*.{ico,png,txt}"
              "views/**/*.html"
              "images/**/*"
              "fonts/*"
              "styles/*.htc"
            ]
          }
        ]
      templates:
        files: [
          {
            expand: true
            cwd: "<%= settings.app %>"
            dest: "<%= settings.dist %>"
            src: [
              "directives/**/*.template"
            ]
          }
        ]
      widgetsTemplates:
        files: [
          {
            expand: true
            cwd: "<%= settings.widgets %>"
            dest: "<%= settings.dist %>/widgets"
            src: [
              "**/*.template"
            ]
          }
        ]

    develop:
      server:
        file: 'server.js'

    watch:
      js:
        files: ['<%= settings.app %>/**/*.js', '<%= settings.widgets %>/**/view/*.js']
        tasks: ['ngAnnotate', 'develop']
        options: { nospawn: true }
      less:
        files: ['<%= settings.app %>/**/*.less', '<%= settings.widgets %>/**/*.less', ]
        tasks: ['less', 'develop']
        options: { nospawn: true }
      templatesCopy:
        files: ['<%= settings.app %>/**/*.template', '<%= settings.widgets %>/**/*.template']
        tasks: ['copy:templates', 'copy:widgetsTemplates', 'develop']
        options: { nospawn: true }
      viewsCopy:
        files: ['<%= settings.app %>/views/**/*.html']
        tasks: ['copy:distStatic', 'develop']
        options: { nospawn: true }

  # include source

    includeSource:
        options:
          basePath: '<%= settings.dist %>/'
          baseUrl: '/'

        includeJS:
          files:
            '<%= settings.dist %>/index.html': '<%= settings.app %>/index.template'


  ###############################################################
  # Aliases
  ###############################################################

  grunt.registerTask 'prepare_build', [
    'clean'
    'ngAnnotate'
    'less'
    'includeSource'
    'wiredep'
    'copy:distStatic'
    'copy:templates'
    'copy:widgetsTemplates'
    'develop'
  ]

  ###############################################################
  # Jobs
  ###############################################################

  # omg, they gonna serve it!
  grunt.registerTask 'serve', [
    'prepare_build'
    'watch'
  ]

  # build production ready result
  grunt.registerTask 'build', [
    'prepare_build'
  ]

