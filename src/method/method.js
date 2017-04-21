Vue.component('api-method', {
	props: ['method', 'index', 'maintags'],
	data: function() {
		return {
            visible: false,
            schemaEditor: undefined
        }
	},
    methods: {
        toggleBody : function() {
            this.visible = !this.visible;
            //$(this.hashUid).collapse('toggle');
            if (this.visible) {
                Vue.nextTick(function(){
                    this.tagSetup();
                },this);
            }
        },
		selectTab: function (name, $event) {
			$('.method-tab').removeClass('is-active');
			$('.tabItem-method-'+name).addClass('is-active');
			$('.method-pane').addClass('hidden');
			$('.method-pane-'+name).removeClass('hidden');
			$event.preventDefault();
		},
        addOperation : function() {
            this.$parent.addOperation();
        },
        duplicateOperation : function(method) {
            this.$parent.addOperation(method);
        },
		removeOperation : function(target) {
            this.$parent.removeOperation(target);
	    },
        addParameter : function() {
            var newParam = {};
            newParam.name = 'newParam';
            newParam.in = 'query';
            newParam.required = false;
            newParam.schema = {};
            newParam.schema.type = 'string';
            this.method.parameters.push(newParam);
        },
        removeParameter : function(index) {
            this.$root.save();
            this.method.parameters.splice(index,1);
        },
        addResponse : function() {
            var status = 200;
            while (this.method.responses[status]) {
                status++;
            }
            var response = {};
            response.description = 'Description';
            Vue.set(this.method.responses, status, response);
        },
        editResponse : function(status) {
            var response = this.method.responses[status];
            if (!response.schema) {
                Vue.set(response, 'schema', {});
            }
            var initial = deref(response.schema,this.$root.container.openapi);
            var editorOptions = {
                theme: 'bootstrap2',
                iconlib: 'fontawesome3',
                schema: jsonSchemaDraft4,
                refs: this.$root.container.openapi,
                startval: initial
            };
            var element = document.getElementById('schemaContainer');
            try {
                this.schemaEditor = new JSONEditor(element, editorOptions);
                schemaEditorClose = function() {
                    this.schemaEditor.destroy();
                    $('#schemaModal').modal('hide');
                }.bind(this);
                schemaEditorSave = function() {
                    this.response.schema = this.schemaEditor.getValue();
                    schemaEditorClose();
                }.bind(this);
                var modalOptions = {};
                $('#schemaModal').modal(modalOptions);
            }
            catch (ex) {
                bootbox.alert('The editor could not be instantiated. Circular schemas are not yet supported');
            }
        },
        tagSetup : function() {
            var simpleTags = [];
            for (var t in this.maintags) {
                simpleTags.push(this.maintags[t].name);
            }
            $(this.hashTagId).tagsinput({
                typeahead: {
                    name: this.tagId,
                    source: function(query) {
                        return simpleTags;
                    }
                }
            });
            for (var t in this.method.tags) {
                $(this.hashTagId).tagsinput('add', this.method.tags[t]);
            }
            $(this.hashTagId).on('itemAdded', function(event) {
                // event.item: contains the item. Convert jQuery event to native event for vue.js
                var e = document.createEvent('HTMLEvents');
                e.initEvent('change', true, true);
                setTimeout(function(){
                    this.dispatchEvent(e);
                },0);
            });
            $(this.hashTagId).on('itemRemoved', function(event) {
                // event.item: contains the item. Convert jQuery event to native event for vue.js
                var e = document.createEvent('HTMLEvents');
                e.initEvent('change', true, true);
                setTimeout(function(){
                    this.dispatchEvent(e);
                },0);
            });
        }
    },
    computed: {
        httpMethod : {
            get : function() {
                return this.index.toUpperCase();
            },
            set : function(newVal) {
                this.$parent.renameOperation(this.index, newVal.toLowerCase());
            }
        },
        hashUid : function() {
            return '#'+this._uid;
        },
        tagId : function() {
            return 'tags-input'+this._uid;
        },
        hashTagId : function() {
            return '#'+this.tagId;
        },
        vtags : {
            get : function() {
				if (!this.method.tags) Vue.set(this.method, 'tags', []);
                return this.method.tags;
            },
            set : function(newVal) {
                this.method.tags = newVal;
            }
        }
    },
    beforeMount : function() {
        if (!this.method.externalDocs) {
            Vue.set(this.method, 'externalDocs', {});
        }
    },
	template: '#template-method'
});

Vue.component('api-response', {
    props: ["response", "status", "method"],
    computed: {
        statusCode: {
            get: function () {
                return this.status;
            },
            set: function (newVal) {
                this.$parent.renameResponse(this.status, newVal);
            }
        }
    },
    methods: {
        editResponse: function () {
            this.$parent.editResponse(this.status);
        },
        removeResponse: function () {
            this.$root.save();
            Vue.delete(this.method.responses, this.status);
        }
    },
    data: function () {
        return {}
    }
});
