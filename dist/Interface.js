!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Interface=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Interface = function( descriptor ) {
	this.descriptor = descriptor;
};

Interface.prototype.descriptor = null;

Interface.prototype.compare = function( classToCheck ) {

	for( var i  in this.descriptor ) {
		// First we'll check if this property exists on the class
		if( classToCheck.prototype[ i ] === undefined ) {

			throw 'INTERFACE ERROR: ' + i + ' is not defined in the class';

		// Second we'll check that the types expected match
		} else if( typeof this.descriptor[ i ] != typeof classToCheck.prototype[ i ] ) {

			throw 'INTERFACE ERROR: Interface and class define items of different type for ' + i + 
				  '\ninterface[ ' + i + ' ] == ' + typeof this.descriptor[ i ] +
				  '\nclass[ ' + i + ' ] == ' + typeof classToCheck.prototype[ i ];

		// Third if this property is a function we'll check that they expect the same amount of parameters
		} else if( typeof this.descriptor[ i ] == 'function' && classToCheck.prototype[ i ].length != this.descriptor[ i ].length ) {

			throw 'INTERFACE ERROR: Interface and class expect a different amount of parameters for the function ' + i +
				  '\nEXPECTED: ' + this.descriptor[ i ].length + 
				  '\nRECEIVED: ' + classToCheck.prototype[ i ].length;

		}
	}
};

module.exports = Interface;
},{}]},{},[1])
(1)
});