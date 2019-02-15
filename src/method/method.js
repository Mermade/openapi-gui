Vue.component('api-method', {
	props: ['method', 'index', 'maintags'],
	data: function() {
		return {
            visible: false,
            schemaEditor: undefined,
            cbName: undefined,
            expName: undefined
        }
	},
    methods: {
		specLink: function(fragment) {
			return this.$root.specLink(fragment);
		},
		markdownPreview: function() {
			this.$parent.$parent.markdownPreview('#'+this.descId);
		},
        toggleBody : function() {
            this.visible = !this.visible;
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
        addRequestBody : function() {
            if (!this.method.requestBody) {
                var rb = {};
                rb.content = { '*/*': { required: false, schema: {} } };
                Vue.set(this.method,'requestBody',rb);
            }
        },
        removeRequestBody : function() {
            this.$root.save();
            Vue.delete(this.method,'requestBody');
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
        renameResponse : function(status, newVal) {
            Vue.set(this.method.responses,newVal,this.method.responses[status]);
            Vue.delete(this.method.responses,status);
        },
        addMediaType : function() {
            var rb = this.effectiveRequestBody;
            if (rb && rb.content && !rb.content['change/me']) {
                Vue.set(rb.content,'change/me',{schema:{}});
            }
        },
        addCallback : function() {
            if (!this.method.callbacks) {
                Vue.set(this.method,'callbacks',{});
            }
            if (!this.method.callbacks.newCallback) {
                Vue.set(this.method.callbacks,'newCallback',{newExpression:{}});
            }
        },
        duplicateCallback : function(cbname) {
            if (!this.method.callbacks.newCallback) {
                Vue.set(this.method.callbacks,'newCallback',clone(this.method.callbacks[cbname]));
            }
        },
        removeCallback : function(cbname) {
            Vue.delete(this.method.callbacks,cbname);
        },
        storeCallbackName : function(oldName) {
            this.cbName = oldName;
        },
        renameCallback : function(newName) {
            Vue.set(this.method.callbacks,newName,this.method.callbacks[this.cbName]);
            Vue.delete(this.method.callbacks,this.cbName);
        },
        addCallbackURL : function(cbname) {
            if (!this.method.callbacks[cbname].newExpression) {
                Vue.set(this.method.callbacks[cbname],'newExpression',{});
            }
        },
        duplicateExpression : function(cbname, expname) {
            if (!this.method.callbacks[cbname].newExpression) {
                Vue.set(this.method.callbacks[cbname],'newExpression',clone(this.method.callbacks[cbname][expname]));
            }
        },
        removeExpression : function(cbname, expname) {
            Vue.delete(this.method.callbacks[cbname],expname);
        },
        storeExpressionName : function(oldName) {
            this.expName = oldName;
        },
        renameExpression : function(cbName, newName) {
            Vue.set(this.method.callbacks[cbName],newName,this.method.callbacks[cbName][this.expName]);
            Vue.delete(this.method.callbacks[cbName],this.expName);
        },
        addExpressionOperation : function(exp) {
			if (!exp.get) {
				Vue.set(exp,'get',{parameters:[],responses:{default:{description:'Default response'}}});
			}
        },
        removeSecScheme : function(index) {
            this.method.security.splice(index,1);
            Vue.set(this.method,'security',this.method.security);
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
		descId : function() {
			return 'txtOpDesc'+this._uid;
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
        },
        mtags : {
            get: function() {
                var result = [];
                if (this.maintags) {
                    for (var i=0;i<this.maintags.length;i++) {
                        result.push(this.maintags[i].name);
                    }
                }
                return result;
            }
        },
        effectiveRequestBody : {
            get : function() {
                if (!this.method.requestBody) return null;
                if (!this.method.requestBody.$ref) return this.method.requestBody;
                return deref(this.method.requestBody, this.$root.container.openapi, true);
            }
        },
        secType :  {
            get : function() {
                if (!this.method.security) return 'default';
                if (this.method.security && this.method.security.length === 0) return 'none';
                return 'custom';
            },
            set : function(newVal) {
                if (newVal == 'default') {
                    Vue.delete(this.method, 'security');
                }
                else if (newVal == 'none') {
                    Vue.set(this.method, 'security', []);
                }
                else {
                    var newSec = clone(this.$root.container.openapi.security);
                    if (!newSec || newSec.length === 0) {
                        newSec = [];
                        for (s in this.$root.container.openapi.components.securitySchemes) {
                            var scheme = this.$root.container.openapi.components.securitySchemes[s];
                            var scopes = [];
                            if (scheme.type === 'oauth2') {
                                for (var f in scheme.flows) {
                                    var flow = scheme.flows[f];
                                    if (flow.scopes) {
                                        for (sc in flow.scopes) {
                                            if (scopes.indexOf(s) < 0) scopes.push(sc);
                                        }
                                    }
                                }
                            }
                            var entry = {};
                            entry[s] = scopes;
                            newSec.push(entry);
                        }
                    }
                    Vue.set(this.method, 'security', newSec);
                }
            }
        }
    },
    beforeUpdate : function() {
        if (!this.method.externalDocs) {
            Vue.set(this.method, 'externalDocs', {});
        }
    },
	beforeMount : this.beforeUpdate,
	template: '#template-method'
});

Vue.component('api-response', {
    props: ["response", "status", "method"],
    beforeMount : function() {
        if (this.method.responses[this.status].$ref) {
            var ptr = this.method.responses[this.status].$ref.substr(1); // remove #
            try {
                var def = new JSONPointer(ptr).get(this.$root.container.openapi);
                for (var p in def) {
                    this.response[p] = def[p];
                }
                delete this.response.$ref;
            }
            catch (ex) {
                this.$root.showAlert('Could not find $ref '+this.method.responses[this.status].$ref);
            }
        }
    },
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
        addResponse: function () {
            this.$parent.addResponse();
        },
        removeResponse: function () {
            this.$root.save();
            Vue.delete(this.method.responses, this.status);
            if (Object.keys(this.method.responses).length==0) {
                Vue.set(this.method.responses,'default',{description:'Default response'});
            }
        },
        duplicateResponse: function () {
            let newStatus = 'default';
            if (this.method.responses.default) {
                newStatus = 200;
                while (this.method.responses[newStatus.toString()]) {
                    newStatus++;
                }
                newStatus = newStatus.toString();
            }
            Vue.set(this.method.responses,newStatus,clone(this.method.responses[this.status]));
        },
        addMediaType: function() {
            if (!this.response.content) {
                Vue.set(this.response,'content',{});
            }
            if (!this.response.content['change/me']) {
                Vue.set(this.response.content,'change/me',{schema:{}});
            }
        },
        renameMediaType: function(oldName, newName) {
            Vue.set(this.response.content, newName, this.response.content[oldName]);
            Vue.delete(this.response.content, oldName);
        }
    },
    data: function () {
        return {}
    }
});

Vue.component('api-mediatype', {
    props: ["content", "mediatype", "container"],
    computed: {
        mediaTypeName: {
            get: function () {
                return this.mediatype;
            },
            set: function (newVal) {
                this.$parent.renameMediaType(this.mediatype, newVal);
            }
        },
		schemaTooltip : {
			get : function() {
				if (!this.content.schema || !this.content.schema.$ref) {
					return 'Edit inline schema';
				}
				else {
					var schemaName = this.content.schema.$ref.replace('#/components/schemas/','');
					return 'Edit shared schema ('+schemaName+')';
				}
			}
		},
        selectedSchema: {
            get : function() {
                var ref = this.content.schema ? this.content.schema.$ref : '';
                if (ref) {
                    return ref.replace('#/components/schemas/','');
                }
                return undefined;
            },
            set : function(newVal) {
                Vue.set(this.content,'schema',{ $ref: '#/components/schemas/'+newVal });
                $('#'+this._uid).addClass('hidden');
                Buefy.Toast.open({
                    message: 'Schema '+newVal+' attached',
                    type: 'is-success'
                })
            }
        }
    },
    methods: {
        addMediaType: function () {
            this.$parent.addMediaType();
        },
        duplicateMediaType: function() {
            if (!this.container.content['change/me']) {
                var newContent = clone(this.content);
                Vue.set(this.container.content,'change/me',newContent);
            }
        },
        editMediaType: function (mediatype) {
            var initial = deref(this.container.content[mediatype].schema,this.$root.container.openapi);
            var editorOptions = {};
            var element = document.getElementById('schemaContainer');
            try {
                this.schemaEditor = new JSONEditor(element, editorOptions);
				this.schemaEditor.set(initial);
				this.schemaEditor.expandAll();
                schemaEditorClose = function() {
                    this.schemaEditor.destroy();
                    $('#schemaModal').removeClass('is-active');
                }.bind(this);
                schemaEditorSave = function() {
                    // TODO saving back to shared schema
                    this.container.content[mediatype].schema = this.schemaEditor.get();
                    schemaEditorClose();
                }.bind(this);
                $('#schemaModal').addClass('is-active');
            }
            catch (ex) {
                this.$parent.$parent.showAlert('The editor could not be instantiated (circular schemas are not yet supported): '+ex.message);
            }
        },
        removeMediaType: function () {
            this.$root.save();
            Vue.delete(this.container.content, this.mediatype);
            if (Object.keys(this.container.content).length==0) {
                Vue.set(this.container.content,'application/json',{schema:{}});
            }
        },
        attachSchema : function(mediatype) {
            $('#'+this._uid).removeClass('hidden');
        }
    },
    data: function () {
        return {}
    }
});
