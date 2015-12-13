module.exports.tasks =

  babel:
      options: 
          sourceMap: true
          presets: ['es2015']
      dist:
          files: 
               '<%= settings.dist %>/scripts/app.js': '<%= settings.dist %>/scripts/app.js'
    
       