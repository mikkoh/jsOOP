module.exports = function( Class, Interface, Enum ) {

	var BaseBaseBaseClass = new Class( {
		inheritedProp: 0,

		functionChain: function( startVal ) {
			//I AM BASE BASE BASE

			return startVal * 2;
		}
	});

	var BaseBaseClass = new Class( {
		Extends: BaseBaseBaseClass,

		initialize: function() {
			//I AM BASE BASE

			this.parent();

			this.inheritedProp++;
		},

		functionChain: function( startVal ) {
			//I AM BASE BASE

			return this.parent( startVal ) * 2;
		}
	});

	var BaseClass = new Class( {
		Extends: BaseBaseClass,

		initialize: function() {
			//I AM BASE

			this.parent();

			this.inheritedProp++;
		},

		prop2: {
			get: function() {
				return this.parent();
			},

			set: function( value ) {
				this.parent( value );
			}
		},

		prop2: {
			get: function() {
				return this.inheritedProp;
			},

			set: function( value ) {
				this.inheritedProp = value;
			}
		},

		functionChain: function( startVal ) {
			//I AM BASE

			return this.parent( startVal ) * 2;
		}
	});



	var IClassToTest = new Interface( {
		functionChain: function( testProp1 ) {},
		inheritedProp: 0
	});




	var ClassToTest = new Class( {
		Extends: BaseClass,

		initialize: function() {
			//I AM CLASS TO TEST

			this.parent();	

			this.inheritedProp++;
		},

		prop2: {
			get: function() {
				return this.parent();
			},

			set: function( value ) {
				this.parent( value );
			}
		},

		functionChain: function( startVal ) {
			//I AM CLASS TO TEST

			return this.parent( startVal );
		}
	}, IClassToTest);




	var instance = new ClassToTest();

	test( 'Testing chaining prototype functions', function() {
		ok( instance.inheritedProp == 3, 'CONSTRUCTOR CHAIN' );
		ok( instance.functionChain( 1 ) == 8, 'FUNCTION CHAIN' );
		ok( instance.prop2 == 3, 'GETTER CHAIN' );
		instance.prop2 = 33;
		ok( instance.prop2 == 33, 'SETTER CHAIN' );
	});
};