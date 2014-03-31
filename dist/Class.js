!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Class=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var BaseClass = _dereq_( './baseClass' );

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
},{"./baseClass":2}],2:[function(_dereq_,module,exports){
module.exports = {
	parent: function() {
		// if the current function calling is the constructor
		if( this.parent.caller.$$isConstructor ) {
			var parentFunction = this.parent.caller.$$parentConstructor;
		} else {
			if( this.parent.caller.$$name ) {
				var callerName = this.parent.caller.$$name;
				var isGetter = this.parent.caller.$$owner.$$getters[ callerName ];
				var isSetter = this.parent.caller.$$owner.$$setters[ callerName ];

				if( arguments.length == 1 && isSetter ) {
					var parentFunction = Object.getPrototypeOf( this.parent.caller.$$owner ).$$setters[ callerName ];

					if( parentFunction === undefined ) {
						throw 'No setter defined in parent';
					}
				} else if( arguments.length == 0 && isGetter ) {
					var parentFunction = Object.getPrototypeOf( this.parent.caller.$$owner ).$$getters[ callerName ];

					if( parentFunction === undefined ) {
						throw 'No getter defined in parent';
					}
				} else if( isSetter || isGetter ) {
					throw 'Incorrect amount of arguments sent to getter or setter';
				} else {
					var parentFunction = Object.getPrototypeOf( this.parent.caller.$$owner )[ callerName ];	

    				if( parentFunction === undefined ) {
						throw 'No parent function defined for ' + callerName;
					}
				}
			} else {
				throw 'You cannot call parent here';
			}
		}

		return parentFunction.apply( this, arguments );
	}
};
},{}]},{},[1])
(1)
});