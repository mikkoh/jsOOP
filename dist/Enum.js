!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Enum=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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
},{"./baseClass":3}],2:[function(_dereq_,module,exports){
var Class = _dereq_( './Class' );

/*
// First argument is an array of string values
// Second argument is an optional base class
// The base class should inherit from Enum.Base 
// Then, each enum element can be specified as an array of arguments to the class

//A simple example
/////////////////////////////
var Direction = new Enum([
	'North',
	'East',
	'South',
	'West'
]);
console.log( Direction.North.value ); // same as Direction.North.toString()
console.log( Direction.values ); // array of enum vals

//A more advanced example..
//////////////////////////////
var Days = new Enum([
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	['Saturday', true],
	['Sunday', true]
], new Class({

	Extends: Enum.Base, 

	isWeekend: false,
	
	initialize: function( value, isWeekend ) {
		this.parent( value ); // ensure you call parent constructor
		this.isWeekend = !!isWeekend;
	}
}));

console.log(Days.toString()); // => [ Monday, Tuesday, .. ]
console.log(Days.values); // => the array of values
console.log(Days.Monday.toString(), Days.Monday.isWeekend); // => Monday false
console.log(Days.Saturday.toString(), Days.Saturday.isWeekend); // => Saturday true
console.log(Days.Wednesday.ordinal); // => 2
console.log(Days.fromValue("Thursday").ordinal); // => 3
*/

//The resulting Enum class
var EnumResult = new Class({
	values: null,

	initialize: function () {
		this.values = [];
	},

	toString: function () {
		return "[ "+this.values.join(", ")+" ]";
	},

	fromValue: function (str) {
		for (var i=0; i<this.values.length; i++) {
			if (str === this.values[i].value)
				return this.values[i];
		}
		return null;
	}
});

var Enum = function ( elements, base ) {
	if (!base)
		base = Enum.Base;
	
	var ret = new EnumResult();

	for (var i=0; i<elements.length; i++) {
		var e = elements[i];

		var obj = null;
		var key = null;

		if (!e)
			throw "enum value at index "+i+" is undefined";

		if (typeof e === "string") {
			key = e;
			obj = new base(e);
			ret[e] = obj;
		} else {
			// var isArr = false;
			// if (typeof Array.isArray === "function")
			// 	isArr = Array.isArray(e);
			// else
			// 	isArr = Object.prototype.toString.call( e ) === '[object Array]';

			if (!Array.isArray(e))
				throw "enum values must be String or an array of arguments";

			key = e[0];

			//first arg is ignored
			e.unshift(null);
			obj = new (Function.prototype.bind.apply(base, e));

			if ( !(obj instanceof Enum.Base) )
				throw "enum base class must be a subclass of Enum.Base";

			ret[key] = obj;
		}

		obj.ordinal = i;
		ret.values.push(obj);
		Object.freeze(obj);
	};

	Object.freeze(ret);
	Object.freeze(ret.values);
	return ret;
};

// The base class for individual enum objects
Enum.Base = new Class({

	value: undefined,

	initialize: function ( key ) {
		this.value = key;
	},

	toString: function() {
		return this.value || this.parent();
	},

	valueOf: function() {
		return this.value || this.parent();
	}
});

module.exports = Enum;

},{"./Class":1}],3:[function(_dereq_,module,exports){
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
},{}]},{},[2])
(2)
});