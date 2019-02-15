const { required } = window.validators;

Vue.component('gui-main', {
	props: ['openapi', 'importschema'],
	data: function () {
		return {
			cgData : cgData,
            currentSchema: ''
		}
	},
	methods: {

		specLink: function(fragment) {
            return this.$root.specLink(fragment);
        },

		markdownPreview: function(selector) {
			$('#mdPreview').addClass('is-active');
			var str = $(selector).val();
			var md = window.markdownit();
			var result = md.render(str);
			$('#mdPreviewText').html(result);
			$('#mdPreviewClose').click(function(){
				$('#mdPreview').removeClass('is-active');
			});
		},

		enableLicenseSelect: function() {
			if ($('#drpLicense').hasClass('hidden')) {
				$('#txtLicense').addClass('hidden');
				$('#drpLicense').removeClass('hidden');
				var openapi = this.openapi;
				$('#selLicense').on('change',function(e){
					var license = $('#selLicense').val();
					$('#txtLicense').val(license);
					if (license == 'MIT') Vue.set(openapi.info.license,'url','https://opensource.org/licenses/MIT');
					if (license == 'Apache-2.0') Vue.set(openapi.info.license,'url','https://opensource.org/licenses/Apache-2.0');
					if (license == 'CC BY-SA 4.0') Vue.set(openapi.info.license,'url','https://creativecommons.org/licenses/by/4.0/');
					if (license == 'CC NC-SA 4.0') Vue.set(openapi.info.license,'url','https://creativecommons.org/licenses/by-nc/4.0/');
					if (license == '') Vue.set(openapi.info.license,'url','');
				});
			}
			else {
				$('#txtLicense').removeClass('hidden');
				$('#drpLicense').addClass('hidden');
			}
		},

		addResource: function () {
			if (!this.openapi.paths) Vue.set(this.openapi, 'paths', {});
			if (!this.openapi.paths['/newPath']) {
				Vue.set(this.openapi.paths, '/newPath', {});
				$('html,body').animate({ scrollTop: document.body.scrollHeight }, "fast");
			}
		},

		showResource: function (key) {
			var target = 'resource_' + key.split('/').join('').split('{').join('').split('}').join('');
			var e = document.getElementById(target);
			if (e) e.scrollIntoView();
		},

		removeAll: function () {
			var self = this;
			this.showConfirm('Are you sure?','This action will remove all paths, operations and parameters. Undo will be available.', function (result) {
				if (result) {
					self.$root.save();
					self.openapi.paths = {};
				}
			});
		},

		petstore: function () {
			Vue.set(this.importschema,'text',JSON.stringify(petstore,null,2));
			Vue.set(this.$root.container,'openapi',preProcessDefinition(petstore));
		},

		addTag: function () {
			if (!this.openapi.tags) {
				Vue.set(this.openapi, 'tags', []);
			}
			if (!this.openapi.tags.newTag) {
				var newTag = {};
				newTag.name = 'newTag';
				newTag.externalDocs = {};
				this.openapi.tags.push(newTag);
			}
		},

		removeTag: function (index) {
			this.$root.save();
			this.openapi.tags.splice(index, 1);
		},

		addSecurityDefinition: function () {
			if (!this.openapi.components.securitySchemes) {
				Vue.set(this.openapi.components, 'securitySchemes', {});
			}
			if (!this.openapi.components.securitySchemes.newSecurityScheme) {
				var newSecDef = {};
				newSecDef.type = 'apiKey';
				newSecDef.name = 'api_key';
				newSecDef.in = 'query';
				Vue.set(this.openapi.components.securitySchemes, 'newSecurityScheme', newSecDef);
			}
		},

		renameSecurityDefinition: function (oldName, newName) {
			Vue.set(this.openapi.components.securitySchemes, newName, this.openapi.components.securitySchemes[oldName]);
			Vue.delete(this.openapi.components.securitySchemes, oldName);
		},

		filterSecurityDefinition: function(security, sdname) {
			var index = -1;
			for (var s=0;s<security.length;s++) {
				var sr = security[s];
				if (typeof sr[sdname] !== 'undefined') {
					index = s;
				}
			}
			if (index >= 0) {
				security.splice(index, 1);
			}
		},

		removeSecurityDefinition: function (index) {
			this.$root.save();
			Vue.delete(this.openapi.components.securitySchemes, index);
			this.filterSecurityDefinition(this.openapi.security, index);
			for (var p in this.openapi.paths) {
				var path = this.openapi.paths[p];
				for (var o in path) {
					var op = path[o];
					if (op.security) {
						this.filterSecurityDefinition(op.security, index);
					}
				}
			}
		},

		addServer: function () {
			if (!this.openapi.servers) Vue.set(this.openapi, 'servers', []);
			this.openapi.servers.push({url:'',description:''});
		},

		removeServer: function(index) {
			this.openapi.servers.splice(index,1);
		},

		addVariable: function (serverIndex) {
			if (!this.openapi.servers[serverIndex].variables) Vue.set(this.openapi.servers[serverIndex],'variables',{});
			Vue.set(this.openapi.servers[serverIndex].variables,'newVar',{description:'',default:'change-me'});
		},

		renameVariable : function(server, oldName, newName) {
			Vue.set(server.variables, newName, server.variables[oldName]);
			Vue.delete(server.variables, oldName);
		},

		removeVariable: function (server,index) {
			Vue.delete(server.variables,index);
		},

		addSchema: function() {
			if (!this.openapi.components.schemas.NewSchema) {
				Vue.set(this.openapi.components.schemas, 'NewSchema', {type: 'object'});
			}
		},

		duplicateSchema: function(key) {
			if (!this.openapi.components.schemas.NewSchema) {
				Vue.set(this.openapi.components.schemas, 'NewSchema', this.openapi.components.schemas[key]);
			}
		},

		editSchema: function(key) {
            var initial = deref(this.$root.container.openapi.components.schemas[key], this.$root.container.openapi);
            var editorOptions = {};
            var element = document.getElementById('schemaContainer');
            this.schemaEditor = new JSONEditor(element, editorOptions, initial);
            schemaEditorClose = function() {
                this.schemaEditor.destroy();
                $('#schemaModal').removeClass('is-active');
            }.bind(this);
            schemaEditorSave = function() {
                this.$root.container.openapi.components.schemas[key] = this.schemaEditor.get();
                schemaEditorClose();
            }.bind(this);
            $('#schemaModalTitle').text('Schema Editor - '+key);
            $('#schemaModalCard').addClass('componentSchema'); // css fix
            $('#schemaModal').addClass('is-active');
		},

		removeSchema: function(key) {
			Vue.delete(this.openapi.components.schemas, key);
		},

        storeSchemaName: function(key) {
            this.currentSchema = key;
        },

        renameSchema: function(key) {
			Vue.set(this.openapi.components.schemas, key, this.openapi.components.schemas[this.currentSchema]);
			Vue.delete(this.openapi.components.schemas, this.currentSchema);
        },

		showAlert: function (text, callback) {
			$('#alertText').text(text);
			$('#alert').addClass('is-active');
			$('#alertClose').click(function(){
				if (callback) callback(false);
				$('#alert').removeClass('is-active');
			});
		},

		showConfirm: function(title, text, callback) {
			$('#confirmTitle').text(title);
			$('#confirmSubtitle').text(text);
			$('#confirm').addClass('is-active');
			$('#confirmClose').click(function(){
				if (callback) callback(false);
				$('#confirm').removeClass('is-active');
			});
			$('#confirmCancel').click(function(){
				if (callback) callback(false);
				$('#confirm').removeClass('is-active');
			});
			$('#confirmOk').click(function(){
				if (callback) callback(true);
				$('#confirm').removeClass('is-active');
			});
		},

		loadSchema: function () {
			var schema;
			try {
				schema = JSON.parse(this.importschema.text);
				this.showAlert('JSON definition parsed successfully');
			}
			catch (ex) {
				try {
					schema = jsyaml.safeLoad(this.importschema.text, {json:true});
					this.showAlert('YAML definition parsed successfully');
				}
				catch (ex) {
					this.showAlert('The definition could not be parsed');
				}
			}

			if (!this.importschema) this.importschema = {};
			if (!this.importschema.text) {
				schema = emptyOpenAPI;
				this.importschema.text = JSON.stringify(emptyOpenAPI, null, 2);
			}

			if (schema.openapi && schema.openapi.startsWith('3.0.')) {
				if (window.localStorage) window.localStorage.setItem('openapi3', JSON.stringify(schema));
				schema = preProcessDefinition(schema);
				Vue.set(this.$root.container, 'openapi', schema);
			}
			else if (schema.swagger && schema.swagger === '2.0') {
				var component = this;
                convertOpenApi2(schema,function(schema){
				    if (schema.openapi && schema.openapi.startsWith('3.0.')) {
					    component.showAlert('Definition successfully converted');
					    schema = preProcessDefinition(schema);
					    Vue.set(component.$root.container, 'openapi', schema);
				    }
                });
			}
			else {
				this.showAlert('OpenAPI version must be 2.0 or 3.0.x');
			}
		},

		selectTab: function (name, $event) {
			$('.tabItem').removeClass('is-active');
			$('#tabItem-'+name).addClass('is-active');
			$('.tab-pane').addClass('hidden');
			$('#'+name).removeClass('hidden');
			$event.preventDefault();
		},

		renderOutput: function ($event) {
			this.selectTab('output',$event);
			// Pretty print has an issue correctly rendering output when we modify
			// the content in an already "prettified" element. This hack creates a
			// new element so prettyPrint() will correctly re-render the output
			$('#json-output').html('<pre class="prettyprint"><code id="pretty-json"></code></pre>');
			var def = this.$root.postProcessDefinition();
			output = JSON.stringify(def, null, 4);
			$('#pretty-json').html(output);
			clippy = new Clipboard('#copy-json');
			setTimeout(function(){
				$('pre code').each(function (i, block) {
					hljs.highlightBlock(block);
				});
			},0);
			var data = "text/json;charset=utf-8," + encodeURIComponent(output);
			$('#download-output').attr('href', 'data:' + data);
			$('#download-output').attr('download', 'openapi.json');
		},

		renderOutputYaml: function ($event) {
			this.selectTab('yaml',$event);
			$('#yaml-output').html('<pre class="prettyprint"><code id="pretty-yaml"></code></pre>');
			var def = this.$root.postProcessDefinition();
			try {
				output = jsyaml.dump(def);
			}
			catch (ex) {
				alert(ex.message);
			}
			$('#pretty-yaml').html(output);
			clippy = new Clipboard('#copy-yaml');
			setTimeout(function(){
				$('pre code').each(function (i, block) {
					hljs.highlightBlock(block);
				});
			},0);
			var data = "text/x-yaml;charset=utf-8," + encodeURIComponent(output);
			$('#download-yaml').attr('href', 'data:' + data);
			$('#download-yaml').attr('download', 'openapi.yaml');
		},

		scrollTop: function() {
            window.scrollTo(0,0);
		},

        settings: function() {
            // TODO
        },

		save: function() {
			this.$root.save();
		},

		undo: function() {
			if (window.localStorage) {
				Vue.set(this.$root.container, 'openapi', JSON.parse(window.localStorage.getItem('openapi3')));
			}
		}

	},
	validations: {
		openapi: {
			info: {
				title: {
					required
				},
				version: {
					required
				}
			}
		}
	},
	template: '#template-gui-main'
});

Vue.component('api-secdef', {
	props: ['openapi', 'sd', 'sdname'],
	computed: {
		secname: {
			get : function() {
				return this.sdname;
			},
			set : function(newVal) {
				this.$parent.renameSecurityDefinition(this.sdname, newVal);
			}
		},
		type : {
			get : function() {
				return this.sd.type;
			},
			set : function(newVal) {
				this.sd.type = newVal;
				if (newVal != 'apiKey') {
					Vue.delete(this.sd, 'in');
					Vue.delete(this.sd, 'name');
				}
				if (newVal != 'oauth2') {
					Vue.delete(this.sd, 'flow');
				}
				if (newVal != 'http') {
					Vue.delete(this.sd, 'scheme');
                    Vue.delete(this.sd, 'bearerFormat');
				}
			}
		},
		appliesToAllPaths : {
			get : function() {
				var index = -1;
				for (var s=0;s<this.openapi.security.length;s++) {
					var sr = this.openapi.security[s];
					if (typeof sr[this.sdname] !== 'undefined') {
						index = s;
					}
				}
				return index >= 0 ? true : false;
			},
			set : function(newVal) {
				if (newVal) {
					if (!this.openapi.security) {
						Vue.set(this.openapi, 'security', []);
					}
					var newSr = {};
					newSr[this.sdname] = [];
					for (var s in this.sd.scopes) {
						newSr[this.sdname].push(s);
					}
					this.openapi.security.push(newSr);
				}
				else {
					this.$parent.filterSecurityDefinition(this.openapi.security, this.sdname);
				}
			}
		},
		hasImplicit: {
			get : function() {
				return this.sd.flows && this.sd.flows.implicit;
			},
			set : function(newVal) {
				if (newVal) Vue.set(this.sd.flows,'implicit',{})
				else Vue.delete(this.sd.flows,'implicit');
			}
		},
		hasPassword: {
			get : function() {
				return this.sd.flows && this.sd.flows.password;
			},
			set : function(newVal) {
				if (newVal) Vue.set(this.sd.flows,'password',{})
				else Vue.delete(this.sd.flows,'password');
			}
		},
		hasAuthCode: {
			get : function() {
				return this.sd.flows && this.sd.flows.authorizationCode;
			},
			set : function(newVal) {
				if (newVal) Vue.set(this.sd.flows,'authorizationCode',{})
				else Vue.delete(this.sd.flows,'authorizationCode');
			}
		},
		hasClientCred: {
			get : function() {
				return this.sd.flows && this.sd.flows.clientCredentials;
			},
			set : function(newVal) {
				if (newVal) Vue.set(this.sd.flows,'clientCredentials',{})
				else Vue.delete(this.sd.flows,'clientCredentials');
			}
		}
	},
	methods : {
		addSecurityDefinition : function() {
			this.$parent.addSecurityDefinition();
		},
		removeSecurityDefinition : function(sdname) {
			this.$parent.removeSecurityDefinition(sdname);
		},
		addScope: function (flow) {
			if (!flow.scopes) Vue.set(flow, 'scopes',  {});
			if (!flow.scopes.newScope) {
				Vue.set(flow.scopes, 'newScope', 'description');
			}
		},
		renameScope : function(flow, oldName, newName) {
			Vue.set(flow.scopes, newName, flow.scopes[oldName]);
			Vue.delete(flow.scopes, oldName);
		},
		removeScope: function (flow, sName) {
			this.$root.save();
			Vue.delete(flow.scopes,sName);
		}
	},
	data: function() {
		return {}
	}
});

Vue.component('api-scope', {
	props: ["sd", "sname", "sdname", "flow"],
	computed: {
		scopename: {
			get : function() {
				return this.sname;
			},
			set : function(newVal) {
				this.$parent.renameScope(this.flow, this.sname, newVal);
			}
		}
	},
	methods: {
		addScope: function() {
			this.$parent.addScope(this.flow);
		},
		removeScope: function(flow, sName) {
			this.$parent.removeScope(flow, sName);
		}
	},
	data: function() {
		return {}
	}
});

Vue.component('api-srvvar', {
	props: ["name", "variable", "server"],
	computed: {
		variableName: {
			get : function() {
				return this.name;
			},
			set : function(newVal) {
				this.$parent.renameVariable(this.server, this.name, newVal);
			}
		}
	},
	methods: {
		removeVariable: function() {
			this.$parent.removeVariable(this.server, this.name);
		},
		addVEnum: function() {
			if (!this.variable.enum) Vue.set(this.variable, 'enum', []);
			this.variable.enum.push('newValue');
		}
	},
	data: function() {
		return {}
	}
});

Vue.component('api-venum', {
	props: ["variable", "eindex"],
	computed: {
		vename: {
			get: function() {
				return this.variable.enum[this.eindex];
			},
			set: function(newValue) {
				this.variable.enum[this.eindex] = newValue;
			}
		}
	},
	methods: {
		removeVEnum: function(eIndex) {
			this.variable.enum.splice(eIndex,1);
		},
		addVEnum: function() {
			this.$parent.addVEnum();
		}
	},
	data: function() {
		return {}
	}
});
