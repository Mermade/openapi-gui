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
                if (newVal == 'array') {
                    var items = {};
                    items.type = this.parameter.type;
                    items.format = this.parameter.format;
                    items.default = this.parameter.default;
                    items.pattern = this.parameter.pattern;
                    items.minimum = this.parameter.minimum;
                    items.maximum = this.parameter.maximum;
                    items.exclusiveMinimum = this.parameter.exclusiveMinimum;
                    items.exclusiveMaximum = this.parameter.exclusiveMaximum;
                    items.multipleOf = this.parameter.multipleOf;
                    items.minLength = this.parameter.minLength;
                    items.maxLength = this.parameter.maxLength;
                    Vue.delete(this.parameter, 'format');
                    Vue.delete(this.parameter, 'default');
                    Vue.delete(this.parameter, 'pattern');
                    Vue.delete(this.parameter, 'minimum');
                    Vue.delete(this.parameter, 'maximum');
                    Vue.delete(this.parameter, 'exclusiveMinimum');
                    Vue.delete(this.parameter, 'exclusiveMaximum');
                    Vue.delete(this.parameter, 'multipleOf');
                    Vue.delete(this.parameter, 'minLength');
                    Vue.delete(this.parameter, 'maxLength');
                    Vue.set(this.parameter, 'items', items);
                    Vue.set(this.parameter, 'collectionFormat', 'csv');
                }
                else {
                    Vue.set(this.parameter, 'format', this.parameter.items.format);
                    Vue.set(this.parameter, 'default', this.parameter.items.default);
                    Vue.set(this.parameter, 'pattern', this.parameter.items.pattern);
                    Vue.set(this.parameter, 'minimum', this.parameter.items.minimum);
                    Vue.set(this.parameter, 'maximum', this.parameter.items.maximum);
                    Vue.set(this.parameter, 'exclusiveMinimum', this.parameter.items.exclusiveMinimum);
                    Vue.set(this.parameter, 'exclusiveMaximum', this.parameter.items.exclusiveMaximum);
                    Vue.set(this.parameter, 'multipleOf', this.parameter.items.multipleOf);
                    Vue.set(this.parameter, 'minLength', this.parameter.items.minLength);
                    Vue.set(this.parameter, 'maxLength', this.parameter.items.maxLength);
                    Vue.delete(this.parameter, 'items');
                    Vue.delete(this.parameter, 'collectionFormat');
                    Vue.delete(this.parameter, 'minItems');
                    Vue.delete(this.parameter, 'maxItems');
                    Vue.delete(this.parameter, 'uniqueItems');
                }
                this.parameter.type = newVal;
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
                if (typeof this.parameter.required === 'undefined') return false;
                return this.parameter.required;
            },
            set : function(newVal) {
                this.parameter.required = newVal;
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
		return {
            visible: false,
            schemaEditor: undefined
        }
	},
    methods : {
        toggleBody : function() {
            this.visible = !this.visible;
            $(this.hashUid).collapse('toggle');
        },
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
        editSchema : function() {
            var editorOptions = {
                theme: 'bootstrap2',
                iconlib: 'fontawesome3',
                display_required_only: true,
                schema: jsonSchemaDraft4,
                refs: this.$root.container.openapi,
                startval: this.schema
            };
            var element = document.getElementById('schemaContainer');
            this.schemaEditor = new JSONEditor(element, editorOptions);
            schemaEditorClose = function() {
                this.schemaEditor.destroy();
                $('#schemaModal').modal('hide');
            }.bind(this);
            schemaEditorSave = schemaEditorClose; // for now
            var modalOptions = {};
            $('#schemaModal').modal(modalOptions);
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
        if (this.parameter["$ref"]) {
            var ptr = this.parameter["$ref"].substr(1); // remove #
            try {
                var def = new JSONPointer(ptr).get(this.$root.container.openapi);
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

Vue.component('api-response', {
	props: ["response", "status"],
	computed: {
		statusCode: {
			get : function() {
				return this.status;
			},
			set : function(newVal) {
				this.$parent.renameResponse(this.status, newVal);
			}
		} 
	},
	data: function() {
		return {}
	}
});
