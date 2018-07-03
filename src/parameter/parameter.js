Vue.component('api-parameter', {
	props: ['parameter', 'index'],
    computed: {

        hashUid : function() {
            return '#'+this._uid;
        },

        formatListId : function() {
            return 'listFormats'+this._uid;
        },

		descId: function() {
			return 'txtParmDesc'+this._uid;
		},

        effectiveType : {
            get : function() {
                if (!(this.parameter.schema && this.parameter.schema.type)) return 'object';
                return this.parameter.schema.type;
            },
            set : function(newVal) {
                if (newVal == 'array') {
                    var items = {};
                    items = clone(this.parameter.schema);
                    Vue.set(this.parameter.schema, 'items', items);
                }
                else {
                    Vue.set(this.parameter, 'schema', this.parameter.items.schema);
                    Vue.delete(this.parameter.schema, 'items');
                }
                this.parameter.schema.type = newVal;
            }
        },

        effectiveIn : {
            get : function() {
                if (!this.parameter.in) return 'body';
                return this.parameter.in;
            },
            set : function(newVal) {
                this.parameter.in = newVal;
				if (newVal == 'path') Vue.set(this.parameter, 'required', true);
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
                if (this.parameter.schema.type == 'integer') return ['int32','int64'];
                if (this.parameter.schema.type == 'number') return ['float','double'];
                if (this.parameter.schema.type == 'string') return ['date','date-time','byte','binary','password'];
                return [];
            },
            set : function(newVal) {}
        },

		schemaTooltip : {
			get : function() {
				if (!this.parameter.schema || !this.parameter.schema.$ref) {
					return 'Edit inline schema';
				}
				else {
					var schemaName = this.parameter.schema.$ref.replace('#/components/schemas/','');
					return 'Edit shared schema ('+schemaName+')';
				}
			}
		}

    },
	data: function() {
		return {
            visible: false,
            schemaEditor: undefined
        }
	},
    methods : {
		markdownPreview: function() {
			this.$parent.$parent.$parent.markdownPreview('#'+this.descId);
		},
        toggleBody : function() {
            this.visible = !this.visible;
        },
        isComplex : function() {
            if (this.effectiveType === 'object' ||
                this.effectiveType === 'array' ||
                this.effectiveType === 'file') {
               return true;
            }
            return false;
        },
        addParameter : function() {
            this.$parent.addParameter();
        },
        removeParameter : function() {
            this.$parent.removeParameter(this.index);
        },
        editSchema : function() {
            if (!this.parameter.schema) {
                Vue.set(this.parameter, 'schema', {});
            }
            var initial = deref(this.parameter.schema, this.$root.container.openapi);
            var editorOptions = {};
            var element = document.getElementById('schemaContainer');
            this.schemaEditor = new JSONEditor(element, editorOptions, initial);
            schemaEditorClose = function() {
                this.schemaEditor.destroy();
                $('#schemaModal').removeClass('is-active');
            }.bind(this);
            schemaEditorSave = function() {
                this.parameter.schema = this.schemaEditor.get();
                schemaEditorClose();
            }.bind(this);
            $('#schemaModalTitle').text('Schema Editor - '+this.parameter.name);
            $('#schemaModal').addClass('is-active');
        },
        addEnum : function() {
            if (!this.parameter.schema) {
                Vue.set(this.parameter, 'schema', {});
            }
            if (!this.parameter.schema.enum) {
                Vue.set(this.parameter.schema, 'enum', []);
            }
            this.parameter.schema.enum.push('newValue');
        },
        removeEnum : function(index) {
            this.parameter.schema.enum.splice(index, 1);
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
                this.$root.showAlert('Could not find $ref '+this.parameter["$ref"]);
            }
        }
    }
});
