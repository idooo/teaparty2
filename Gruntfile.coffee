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
        overrides:
          'socket.io-client':
            main: ['socket.io.js']

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
              "widgets/**/*.template"
            ]
          }
        ]

    develop:
      server:
        file: 'server.js'

    watch:
      js:
        files: ['<%= settings.app %>/**/*.js']
        tasks: ['ngAnnotate', 'develop']
        options: { nospawn: true }
      less:
        files: ['<%= settings.app %>/**/*.less']
        tasks: ['less', 'develop']
        options: { nospawn: true }
      templatesCopy:
        files: ['<%= settings.app %>/**/*.template']
        tasks: ['copy:templates', 'develop']
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

