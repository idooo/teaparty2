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
  # Jobs
  ###############################################################

  grunt.registerTask 'test', [
    'eslint:front'
  ]

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
    'test'
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

