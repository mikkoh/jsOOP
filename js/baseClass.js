define( {
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
});