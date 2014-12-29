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
          'ngDialog':
            main: ['js/ngDialog.js', 'css/ngDialog.css']
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
      build:
        files: [
          {
            dot: true
            src: [
              '<%= settings.dist %>/scripts/*.js'
              '!<%= settings.dist %>/scripts/*.min.js'
              '<%= settings.dist %>/styles/*.css'
              '!<%= settings.dist %>/styles/*.min.css'
              '<%= settings.tmp %>'
            ]
          }
        ]

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

    html2js:
      appTemplates:
        options:
          base: 'web/src'
          module: 'app.templates'
          singleModule: true

        src: [
          '<%= settings.app %>/**/*.template',
          '!<%= settings.app %>/index.template'
        ]
        dest: '<%= settings.dist %>/scripts/app_templates.js'

      widgetTemplates:
        options:
          base: ''
          module: 'app.widgets.templates'
          singleModule: true

        src: [ '<%= settings.widgets %>/**/*.template' ]
        dest: '<%= settings.dist %>/scripts/widgets_templates.js'

    useminPrepare:
      html: "<%= settings.dist %>/index.html"
      options:
        dest: "<%= settings.dist %>/"

    usemin:
      html: ["<%= settings.dist %>/{,*/}*.html"]
      css: ["<%= settings.dist %>/{,*/}*.css"]
      options:
        assetsDirs: ["<%= settings.dist %>/", "<%= settings.app %>/"]

    htmlmin:
      default:
        options:
          removeComments: true
          collapseWhitespace: true

        expand: true
        cwd: '<%= settings.dist %>',
        src: ['**/*.html'],
        dest: '<%= settings.dist %>/'

    uglify:
      options:
        compress:
          drop_console: true


  ###############################################################
  # Jobs
  ###############################################################

  # omg, they gonna serve it!
  grunt.registerTask 'serve', [
    'clean'
    'ngAnnotate'
    'less'
    'includeSource'
    'wiredep'
    'copy:distStatic'
    'copy:templates'
    'copy:widgetsTemplates'
    'develop'
    'watch'
  ]

  # build production ready result
  grunt.registerTask 'build', [
    'clean'
    'ngAnnotate'
    'html2js'
    'less'
    'includeSource'
    'wiredep'
    'copy:distStatic'
    'useminPrepare'
    'concat'
    'uglify'
    'cssmin'
    'usemin'
    'htmlmin'
    'clean:build'
  ]

