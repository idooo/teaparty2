module.exports.tasks =

  ngAnnotate:
    build:
      files:
        '<%= settings.dist %>/scripts/app.js': '<%= settings.dist %>/scripts/app.js'
    vendor:
      files:
        '<%= settings.dist %>/scripts/vendor.js': [
          "<%= settings.vendor %>/**/*.js",
        ]
