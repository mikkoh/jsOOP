var Class = require( './Class' );

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
