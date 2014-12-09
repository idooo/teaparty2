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
      dist: 'web/dist'
      tmp: '.tmp'

  # wiredep

    wiredep:
      dev:
        src: '<%= settings.dist %>/index.html'
        dependencies: true
        devDependencies: false

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

  # express

    express:
      options:
        port: process.env.PORT || 9000
      dev:
        options:
          script: 'server.js'

  # less

    less:
      default:
        options:
          yuicompress: true
        files:
          "<%= settings.dist %>/styles/widgets.css": "<%= settings.app %>/widgets/**/*.less"
          "<%= settings.dist %>/styles/main.css": "<%= settings.app %>/styles/index.less"

  # ngmin

    ngAnnotate:
      build:
        files:
          '<%= settings.dist %>/scripts/app.js': ["<%= settings.app %>/app.js", "<%= settings.app %>/**/*.js"]

    copy:
      scripts:
        files: [
          {
            expand: true
            cwd: "<%= settings.app %>"
            dest: "<%= settings.dist %>"
            src: [
              "scripts/**/*",
              "components/**/*.js"
            ]
          }
        ]

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
              "scripts/**/*.template",
              "components/**/*.template"
            ]
          }
        ]

  # watch

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

  ###############################################################
  # Jobs
  ###############################################################

  # omg, they gonna serve it!
  grunt.registerTask 'serve', [

  ]

  # build production ready result
  grunt.registerTask 'build', [
    'clean'
    'ngAnnotate'
    'less'
    'includeSource'
    'wiredep'
  ]
