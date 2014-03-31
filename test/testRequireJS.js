require.config( {
	baseUrl: './',

	paths: {

		jsOOP: '../dist/',
		QUnit: '../app/components/qunit/qunit/qunit'
	},

	shim: {

		QUnit: {

			exports: 'QUnit',

			init: function() {

				QUnit.config.autoload = false;
				QUnit.config.autostart = false;
			}
		}
	}
});

requirejs( [ 'QUnit', 'jsOOP/Class', 'jsOOP/Interface', 'jsOOP/Enum', './doTestsUMD.js' ], function( QUnit, Class, Interface, Enum, doTests ) {
	
	doTests( Class, Interface, Enum  );

	QUnit.load();
    QUnit.start();
});