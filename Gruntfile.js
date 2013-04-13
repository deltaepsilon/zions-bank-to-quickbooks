module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
    	scripts: {
    		files: '*.js',
    		tasks: ['zions']
    	}
    }
  });

  // Default task(s).
  grunt.registerTask('zions', 'Autorun zions script', function () {
  	var done = this.async();
  	require('child_process').exec('node zions.js download.csv', function (error, out) {
  		if (error) {
  			return console.log('error:', error);
  		}
  		
  		console.log('output:')
  		console.log(out);
  	})
  });

  grunt.loadNpmTasks('grunt-contrib-watch');

};