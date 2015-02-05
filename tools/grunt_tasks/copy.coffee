module.exports.tasks =

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
            "styles/fonts/*"
            "styles/*.htc"
          ]
        }
        {
          dest: "<%= settings.dist %>/swf/"
          flatten: true
          expand: true
          src: ["web/bower_components/zeroclipboard/dist/ZeroClipboard.swf"]
        }
      ]

    templates:
      files: [
        {
          expand: true
          cwd: "<%= settings.app %>"
          dest: "<%= settings.dist %>"
          src: [
            "**/*.template"
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
