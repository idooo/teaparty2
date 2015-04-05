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
            "**/*.html"
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

    babelPolyfill:
      files: [
        {
          flatten: true
          expand: true
          dest: "<%= settings.dist %>/../bower_components"
          src: ["node_modules/babel/browser-polyfill.js"]
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
