jsOOP
=====

This library is a way to "sugar" some object oriented functionality in Javascript. It's syntactically based on MooTools 
Class.

So to define a class with a function called foo you'd do the following:
```javascript
var NewClass = new Class({
  foo: function() { }
});
```
Reserved Keywords
-----------------
There are a few reserved keywords in this library which are:

* initialize
* Extends
* parent

initialize
----------
Initialize is used to define a constructor within a function like so:
```javascript
var NewClass = new Class({
  initialize: function() {
    console.log( 'I AM CONSTRUCTOR ** said with transformer voice **' );
  },
  foo: function() { }
});
```

Extends
-------
Extends is used to define inheritance of objects. Let's continue with our example and create a new class that will inherit
from ```NewClass``` and will be called ```NewNewClass```. 

```javascript
var NewClass = new Class({
  initialize: function() {
    console.log( 'I AM CONSTRUCTOR ** said with transformer voice **' );
  },
  foo: function() { 
    console.log( 'I am foo of base class' );  
  }
});

var NewNewClass = new Class({
  initialize: function() {
    console.log( 'I AM CONSTRUCTOR NEW NEW' );
  },
  
  Extends: NewClass,
  
  foo: function() { 
    console.log( 'I am foo of sub class' );  
  }
});
```
As a note Extends is spelt with a capital "E" since in Javascript ```extends``` is a reserved keyword for future purposes.


parent
------
```parent``` is actually a funtion which will be added to each and every ```Class```. It is used to call super class functions.

For instance in our example above we could call the super classes function ```foo``` using the following syntax:
```javascript
var NewClass = new Class({
  initialize: function() {
    console.log( 'I AM CONSTRUCTOR ** said with transformer voice **' );
  },
  foo: function() { 
    console.log( 'I am foo of base class' );  
  }
});

var NewNewClass = new Class({
  initialize: function() {
    console.log( 'I AM CONSTRUCTOR NEW NEW' );
    
    this.parent();
  },
  
  Extends: NewClass,
  
  foo: function() { 
    console.log( 'I am foo of sub class' );
    
    this.parent();
  }
});
```

Also note that ```this.parent();``` will work for constructors, getters and setters also. Getters and setters?

getters and setters
-------------------
Yep with this library you can quickly define getters and setters. This is how you'd define getters and setters:

```javascript
var TiredOfTheAboveExample = new Class({
  _myProp: 0,
  _secondProp: 'I EXIST',
  
  myProp: {
    get: function() {
      return this._prop;
    },
    
    set: function( value ) {
      this._prop = value;
    }
  },
  
  secondProp: {
    get: function() {
      return this._secondProp;
    },
    
    set: function( value ) {
      this._secondProp = value;
    }
  }
});
```
