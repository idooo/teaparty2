module.exports.tasks =

  concat:
    ng:
      src: [
        "<%= settings.app %>/app.js",
        "<%= settings.app %>/**/*.js",
        "<%= settings.widgets %>/**/view/*.js",
      ]
      dest: '<%= settings.dist %>/scripts/app.js'
