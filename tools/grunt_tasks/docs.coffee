module.exports.tasks =

  jsdoc:
    dist:
      src: ['core/**/*.js', '<%= settings.app %>/**/*.js', '<%= settings.widgets %>/**/*.js']
      options:
        destination: 'docs'
        template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
        configure : "tools/config/jsdoc.conf.json"

