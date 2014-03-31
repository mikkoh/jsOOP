require.config( {
	baseUrl: './',

	paths: {

		jsOOP: '../dist/',
		QUnit: '../app/components/qunit/qunit/qunit'
	}
});

requirejs( [ 'jsOOP/Class', 'jsOOP/Interface', 'jsOOP/Enum', './doTestsUMD.js' ], function( Class, Interface, Enum, doTests ) {
	
	doTests( Class, Interface, Enum  );
	
    QUnit.start();
});