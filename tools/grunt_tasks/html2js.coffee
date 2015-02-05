module.exports.tasks =

  html2js:
    appTemplates:
      options:
        base: 'web/src'
        module: 'teaparty2.template'
        singleModule: true

      src: [
        '<%= settings.app %>/**/*.template',
        '!<%= settings.app %>/index.template'
      ]
      dest: '<%= settings.dist %>/scripts/app_templates.js'

    widgetTemplates:
      options:
        base: ''
        module: 'teaparty2.widgets.template'
        singleModule: true

      src: [ '<%= settings.widgets %>/**/*.template' ]
      dest: '<%= settings.dist %>/scripts/widgets_templates.js'
