module.exports.tasks =

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
