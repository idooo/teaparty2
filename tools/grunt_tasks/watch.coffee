module.exports.tasks = 

  watch:
    js:
      files: ['<%= settings.app %>/**/*.js', '<%= settings.widgets %>/**/view/*.js']
      tasks: ['ngAnnotate', 'develop']
      options: { nospawn: true }
    less:
      files: ['<%= settings.app %>/**/*.less', '<%= settings.widgets %>/**/*.less', ]
      tasks: ['less', 'develop']
      options: { nospawn: true }
    templatesCopy:
      files: ['<%= settings.app %>/**/*.template', '<%= settings.widgets %>/**/*.template']
      tasks: ['copy:templates', 'copy:widgetsTemplates', 'develop']
      options: { nospawn: true }
    viewsCopy:
      files: ['<%= settings.app %>/views/**/*.html']
      tasks: ['copy:distStatic', 'develop']
      options: { nospawn: true }
