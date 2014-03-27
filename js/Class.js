var BaseClass = require( './baseClass' );

var Class = function( descriptor ) {

	var rVal = undefined;

	if ( descriptor === undefined ) {

		descriptor = {};
	}


	if( descriptor.initialize ) {

		rVal = descriptor.initialize;
		delete descriptor.initialize;
	} else {

		rVal = function() { 

			Array.prototype.splice.apply( arguments, [ 0, 0, this ] );

			Class.parent.apply( undefined, arguments );
		};
	}

	if( descriptor.Extends !== undefined ) {

		descriptor.Extends.$$isConstructor = true;

		rVal.prototype = Object.create( descriptor.Extends.prototype );
		// this will be used to call the parent constructor
		rVal.$$parentConstructor = descriptor.Extends;
		delete descriptor.Extends;
	} else {

		rVal.prototype = Object.create( BaseClass );
		rVal.$$parentConstructor = function() {};
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

Class.parent = function( scope ) {

	var caller = Class.parent.caller;

	arguments = Array.prototype.slice.apply( arguments, [ 1 ] )

	// if the current function calling is the constructor
	if( caller.$$isConstructor ) {
		var parentFunction = caller.$$parentConstructor;
	} else {
		if( caller.$$name ) {
			var callerName = caller.$$name;
			var isGetter = caller.$$owner.$$getters[ callerName ];
			var isSetter = caller.$$owner.$$setters[ callerName ];

			if( arguments.length == 1 && isSetter ) {
				var parentFunction = Object.getPrototypeOf( caller.$$owner ).$$setters[ callerName ];

				if( parentFunction === undefined ) {
					throw 'No setter defined in parent';
				}
			} else if( arguments.length == 0 && isGetter ) {
				var parentFunction = Object.getPrototypeOf( caller.$$owner ).$$getters[ callerName ];

				if( parentFunction === undefined ) {
					throw 'No getter defined in parent';
				}
			} else if( isSetter || isGetter ) {
				throw 'Incorrect amount of arguments sent to getter or setter';
			} else {
				var parentFunction = Object.getPrototypeOf( caller.$$owner )[ callerName ];	

				if( parentFunction === undefined ) {
					throw 'No parent function defined for ' + callerName;
				}
			}
		} else {
			throw 'You cannot call parent here';
		}
	}

	return parentFunction.apply( scope, arguments );
};

module.exports = Class;