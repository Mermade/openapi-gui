Vue.component('api-parameter', {
	props: ['parameter', 'index'],
    computed: {

        hashUid : function() {
            return '#'+this._uid;
        },

        formatListId : function() {
            return 'listFormats'+this._uid;
        },
        
        effectiveType : {
            get : function() {
                if (!this.parameter.type) return 'object';
                return this.parameter.type;
            },
            set : function(newVal) {
                this.parameter.type = newVal;
                if (this.parameter.type == 'array') {
                    this.parameter.items = {};
                    this.parameter.collectionFormat = 'csv';
                }
                else {
                    Vue.delete(this.parameter, 'items');
                    Vue.delete(this.parameter, 'collectionFormat');
                    Vue.delete(this.parameter, 'minItems');
                    Vue.delete(this.parameter, 'maxItems');
                    Vue.delete(this.parameter, 'uniqueItems');
                }
            } 
        },

        effectiveIn : {
            get : function() {
                if (!this.parameter.in) return 'body';
                return this.parameter.in;
            },
            set : function(newVal) {
                this.parameter.in = newVal;
            } 
        },

        effectiveRequired : {
            get : function() {
                if (typeof this.parameter.required === 'undefined') return 'true';
                return this.parameter.required ? 'true' : 'false';
            },
            set : function(newVal) {
                this.parameter.required = (newVal == 'true' ? true : false);
            } 
        },

        effectiveFormats : {
            get : function() {
                if (this.parameter.type == 'integer') return ['int32','int64'];
                if (this.parameter.type == 'number') return ['float','double'];
                if (this.parameter.type == 'string') return ['date','date-time','byte','binary','password'];
                return [];
            },
            set : function(newVal) {}
        }

    },
	data: function() {
		return {}
	},
    methods : {
        isComplex : function() {
            if (this.effectiveType === 'object' || 
                this.effectiveType === 'array' ||
                this.effectiveType === 'file') {
               return true;
            }
            return false;
        },
        removeParameter : function() {
            this.$parent.removeParameter(this.index);
        },
        addEnum : function() {
            if (!this.parameter.enum) {
                Vue.set(this.parameter, 'enum', []);
            }
            this.parameter.enum.push('newValue');
        },
        removeEnum : function(index) {
            this.parameter.enum.splice(index, 1);
        }
    },
	template: '#template-parameter',
    beforeMount : function() {
        // TODO patch-in shared path-parameters which are not overridden
        if (this.parameter["$ref"]) {
            var ptr = this.parameter["$ref"].substr(1); // remove #
            try {
                var def = new JSONPointer(ptr).get(this.$root.openapi);
                for (var p in def) {
                    this.parameter[p] = def[p];
                }
                delete this.parameter["$ref"];
            }
            catch (ex) {
                bootbox.alert('Could not find $ref '+this.parameter["$ref"]);
            }
        }
    }
});

/*

        var properties = [];

        if ( this.type === 'array' && parameterDefinition.items !== undefined ) {
            groupingProperty = new Property( parameterDefinition.items.title )
            groupingProperty.description = parameterDefinition.items.description;
            groupingProperty.required = parameterDefinition.items.required;
            groupingProperty.default = parameterDefinition.items.default;
            groupingProperty.type = parameterDefinition.items.type;
            groupingProperty.properties = parameterDefinition.items.properties;
            var properties = [groupingProperty];
        }
        else {
            var properties = parameterDefinition.properties;
        }

        angular.forEach(properties, function(propertyDefinition) {
            var property = new Property(propertyDefinition.title);
            property.load(propertyDefinition);
            this.push( property );
        }, this.properties);
    }

        if ( Object.keys(this.properties).length > 0 ) {
            if ( this.type === 'array' ) {
                // Unfortunately IO/Docs doesn't fully support json schema v4
                // so this hack sets the first element in the list to be the
                // only item TODO remove
                val.items = this.properties[0].render() ;
            }
            else {
                val.properties = {};

                angular.forEach(this.properties, function(property) {
                    var key = property.title.replace(/[^\w]/gi, '');
                    this[key] = property.render();
                }, val.properties);
            }
        }

        return val;
    }
}
*/
