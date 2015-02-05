module.exports.tasks =

  eslint:
    front:
      options:
          config: 'tools/config/eslint.ng.json'
      src: ['<%= settings.app %>/**/*.js']
    back:
      options:
          config: 'tools/config/eslint.node.json'
      src: ['<%= settings.backend %>/**/*.js']
