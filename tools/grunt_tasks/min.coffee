module.exports.tasks =

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