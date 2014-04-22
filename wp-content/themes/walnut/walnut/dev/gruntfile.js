module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      combine: {
        files: {
          '../css/production/walnut.min.css': ['css/pace.coinspin.css','css/datepicker.css','css/bootstrap-timepicker.css','css/bootstrap.min.css',
          'css/bootstrap-theme.css','css/font-awesome.css','css/animate.min.css',
          'css/style.css','css/responsive.css','css/custom-icon-set.css','css/custom.css']
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['cssmin']);

};