var browserify = require( 'browserify' );
var fs = require( 'fs' );

/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.registerTask( 'browserify', 'This will Browserify everything', function() {

		var done = this.async();

		browserify( [ './js/Class.js' ] )
		.bundle( { standalone: 'Class' }, done )
		.pipe( fs.createWriteStream( './dist/Class.js' ) );

		// browserify( [ './js/Interface.js' ] )
		// .bundle( { standalone: 'Interface' }, done )
		// .pipe( fs.createWriteStream( './dist/Interface.js' ) );
	});

	// Default task.
	grunt.registerTask( 'default', [ 'browserify' ] );
};
