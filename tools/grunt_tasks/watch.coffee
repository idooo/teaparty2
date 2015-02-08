module.exports.tasks = 

  watch:
    js:
      files: ['<%= settings.app %>/**/*.js', '<%= settings.widgets %>/**/view/*.js']
      tasks: ['concat:ng', '6to5', 'ngAnnotate', 'develop']
      options: { nospawn: true, reload: false }
    less:
      files: ['<%= settings.app %>/**/*.less', '<%= settings.widgets %>/**/*.less', ]
      tasks: ['less', 'develop']
      options: { nospawn: true, reload: false  }
    templatesCopy:
      files: ['<%= settings.app %>/**/*.template', '<%= settings.widgets %>/**/*.template']
      tasks: ['copy:templates', 'copy:widgetsTemplates', 'develop']
      options: { nospawn: true, reload: false  }
    viewsCopy:
      files: ['<%= settings.app %>/views/**/*.html']
      tasks: ['copy:distStatic', 'develop']
      options: { nospawn: true, reload: false  }
