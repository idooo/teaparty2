module.exports.tasks =

  clean:
    default:
      files: [
        {
          dot: true
          src: [
            '<%= settings.dist %>/*'
            '!<%= settings.dist %>/.git*'
          ]
        }
      ]
    build:
      files: [
        {
          dot: true
          src: [
            '<%= settings.dist %>/scripts/*.js'
            '!<%= settings.dist %>/scripts/*.min.js'
            '<%= settings.dist %>/styles/*.css'
            '!<%= settings.dist %>/styles/*.min.css'
            '<%= settings.tmp %>'
          ]
        }
      ]