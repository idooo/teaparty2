module.exports = (grunt) ->

  ##############################################################
  # Options
  ###############################################################

  options =
    config :
        src: "tools/grunt_tasks/*.coffee"

    settings:
      app: 'web/src'
      backend: 'core'
      vendor: 'web/vendor'
      widgets: 'widgets'
      dist: 'web/dist'
      tmp: '.tmp'

  require('load-grunt-tasks')(grunt)
  require('time-grunt')(grunt)

  configs = require('load-grunt-configs')(grunt, options)
  grunt.initConfig(configs)

  ###############################################################
  # Aliases
  ###############################################################

  grunt.registerTask 'serve_prepare', [
    'clean'
    'concat:ng'
    'babel'
    'copy:babelPolyfill'
    'ngAnnotate'
    'less'
    'includeSource'
    'wiredep'
    'copy:distStatic'
    'copy:templates'
    'copy:widgetsTemplates'
  ]

  ###############################################################
  # Jobs
  ###############################################################

  grunt.registerTask 'test', [
    'eslint:front'
  ]

  # omg, they gonna serve it!
  grunt.registerTask 'serve', [
    'serve_prepare'
    'develop:normal'
    'watch'
  ]

  # wow, they wanna mock!
  grunt.registerTask 'mocked', [
    'serve_prepare'
    'develop:mocked'
    'watch'
  ]

  # build production ready result
  grunt.registerTask 'build', [
    'test'
    'clean'
    'concat:ng'
    'babel'
    'copy:babelPolyfill'
    'ngAnnotate'
    'html2js'
    'less'
    'includeSource'
    'wiredep'
    'copy:distStatic'
    'useminPrepare'
    'concat:generated'
    'uglify'
    'cssmin'
    'usemin'
    'htmlmin'
    'clean:build'
  ]

