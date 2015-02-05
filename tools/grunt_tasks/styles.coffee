module.exports.tasks =

  less:
    default:
      options:
        yuicompress: true
      files:
        "<%= settings.dist %>/styles/widgets.css": "<%= settings.widgets %>/**/*.less"
        "<%= settings.dist %>/styles/main.css": "<%= settings.app %>/styles/index.less"
        "<%= settings.dist %>/styles/vendor.css": "<%= settings.vendor %>/**/*.less"
