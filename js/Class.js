define( [ 'jsOOP/baseClass' ], function( BaseClass ) {

	var Class = function( descriptor ) {
		if (!descriptor) 
			descriptor = {};
		
		if( descriptor.initialize ) {
			var rVal = descriptor.initialize;
			delete descriptor.initialize;
		} else {
			rVal = function() { this.parent.apply( this, arguments ); };
		}

		if( descriptor.Extends ) {
			rVal.prototype = Object.create( descriptor.Extends.prototype );
			// this will be used to call the parent constructor
			rVal.$$parentConstructor = descriptor.Extends;
			delete descriptor.Extends;
		} else {
			rVal.$$parentConstructor = function() {}
			rVal.prototype = Object.create( BaseClass );
		}

		rVal.prototype.$$getters = {};
		rVal.prototype.$$setters = {};

		for( var i in descriptor ) {
			if( typeof descriptor[ i ] == 'function' ) {
				descriptor[ i ].$$name = i;
				descriptor[ i ].$$owner = rVal.prototype;

				rVal.prototype[ i ] = descriptor[ i ];
			} else if( descriptor[ i ] && typeof descriptor[ i ] == 'object' && ( descriptor[ i ].get || descriptor[ i ].set ) ) {
				Object.defineProperty( rVal.prototype, i , descriptor[ i ] );

				if( descriptor[ i ].get ) {
					rVal.prototype.$$getters[ i ] = descriptor[ i ].get;
					descriptor[ i ].get.$$name = i;
					descriptor[ i ].get.$$owner = rVal.prototype;
				}

				if( descriptor[ i ].set ) {
					rVal.prototype.$$setters[ i ] = descriptor[ i ].set;
					descriptor[ i ].set.$$name = i;
					descriptor[ i ].set.$$owner = rVal.prototype;	
				}
			} else {
				rVal.prototype[ i ] = descriptor[ i ];
			}
		}

		// this will be used to check if the caller function is the consructor
		rVal.$$isConstructor = true;


		// now we'll check interfaces
		for( var i = 1; i < arguments.length; i++ ) {
			arguments[ i ].compare( rVal );
		}

		return rVal;
	};	

	return Class;
});