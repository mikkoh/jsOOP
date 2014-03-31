var browserify = require( 'browserify' );
var fs = require( 'fs' );

/*global module:false*/
module.exports = function(grunt) {

	grunt.initConfig({

		qunit: {

			all: [ './test/**/*.html' ],
			options: {

				console: true	
			}
		}
	});

	//This task will Browserify the SRC for jsOOP
	grunt.registerTask( 'browserify', 'This will Browserify jsOOP Lib', function() {

		var done = this.async();
		var numDone = 0;
		var checkDone = function() {

			if( ++numDone == 3 ) 
				done();
		};

		//export a standalone version of Class
		browserify( [ './js/Class.js' ] )
		.bundle( { standalone: 'Class' }, checkDone )
		.pipe( fs.createWriteStream( './dist/Class.js' ) );

		//export a standalone version of Interface
		browserify( [ './js/Interface.js' ] )
		.bundle( { standalone: 'Interface' }, checkDone )
		.pipe( fs.createWriteStream( './dist/Interface.js' ) );

		//export a standalone version of Enum
		browserify( [ './js/Enum.js' ] )
		.bundle( { standalone: 'Enum' }, checkDone )
		.pipe( fs.createWriteStream( './dist/Enum.js' ) );
	});

	grunt.registerTask( 'browserifyTests', 'This will Browserify doTests', function() {

		var done = this.async();

		browserify( [ './test/doTests.js' ] )
		.bundle( { standalone: 'doTests' }, done )
		.pipe( fs.createWriteStream( './test/doTestsUMD.js' ) );
	});

	grunt.loadNpmTasks('grunt-contrib-qunit');

	grunt.registerTask( 'test', [ 'browserify', 'browserifyTests', 'qunit' ] );
	grunt.registerTask( 'default', [ 'browserify' ] );
};
