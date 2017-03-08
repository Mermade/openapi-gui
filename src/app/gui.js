Vue.component('gui-main', {
	props: ['openapi', 'importschema'],
	data: function () {
		return {}
	},
	methods: {

		showResource: function (key) {
			var target = 'resource_' + key.split('/').join('').split('{').join('').split('}').join('');
			document.getElementById(target).scrollIntoView();
		},

		addResource: function () {
			if (!this.openapi.paths) Vue.set(this.openapi, 'paths', {});
			if (!this.openapi.paths['/newPath']) {
				Vue.set(this.openapi.paths, '/newPath', {});
				$('html,body').animate({ scrollTop: document.body.scrollHeight }, "fast");
			}
		},

		removePath: function (target) {
			this.$root.save();
			Vue.delete(this.openapi.paths, target);
		},

		renamePath: function (oldPath, newPath) {
			Vue.set(this.openapi.paths, newPath, this.openapi.paths[oldPath]);
			Vue.delete(this.openapi.paths, oldPath);
		},

		removeAll: function () {
			var self = this;
			bootbox.confirm('Remove all paths, methods and parameters, are you sure?', function (result) {
				if (result) {
					self.$root.save();
					self.openapi.paths = {};
				}
			});
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
			if (!this.openapi.securityDefinitions) {
				Vue.set(this.openapi, 'securityDefinitions', {});
			}
			if (!this.openapi.securityDefinitions.newSecurityDef) {
				var newSecDef = {};
				newSecDef.type = 'apiKey';
				newSecDef.name = 'api_key';
				newSecDef.in = 'query';
				Vue.set(this.openapi.securityDefinitions, 'newSecurityDef', newSecDef);
			}
		},

		renameSecurityDefinition: function (oldName, newName) {
			Vue.set(this.openapi.securityDefinitions, newName, this.openapi.securityDefinitions[oldName]);
			Vue.delete(this.openapi.securityDefinitions, oldName);
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
			Vue.delete(this.openapi.securityDefinitions, index);
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

		addConsumes: function () {
			if (!this.openapi.consumes) Vue.set(this.openapi, 'consumes', []);
			this.openapi.consumes.push('mime/type');
		},

		addProduces: function () {
			if (!this.openapi.produces) Vue.set(this.openapi, 'produces', []);
			this.openapi.produces.push('mime/type');
		},

		loadSchema: function () {
			var schema;
			try {
				schema = JSON.parse(this.importschema.text);
				bootbox.alert('JSON definition parsed successfully');
			}
			catch (ex) {
				try {
					schema = jsyaml.safeLoad(this.importschema.text);
					bootbox.alert('YAML definition parsed successfully');
				}
				catch (ex) {
					bootbox.alert('The definition could not be parsed');
				}
			}

			if (!this.importschema) this.importschema = {};
			if (!this.importschema.text) {
				schema = emptyOpenAPI;
				this.importschema.text = JSON.stringify(emptyOpenAPI, null, 2);
			}

			if (schema.openapi.startsWith('3.0.')) {
				if (window.localStorage) window.localStorage.setItem('openapi3', JSON.stringify(schema));
				schema = preProcessDefinition(schema);
				Vue.set(this.$root.container, 'openapi', schema);
			}
			else {
				bootbox.alert('OpenAPI version must be 3.0.x');
			}
		},

		renderOutput: function () {
			// Pretty print has an issue correctly rendering output when we modify
			// the content in an already "prettified" element. This hack creates a
			// new element so prettyPrint() will correctly re-render the output
			$('#json-output').html('<pre class="prettyprint"><code id="pretty-json"></code></pre>');
			var def = this.$root.postProcessDefinition();
			output = JSON.stringify(def, null, 4);
			$('#pretty-json').html(output);
			clippy = new Clipboard('#copy-json');
			$('pre code').each(function (i, block) {
				hljs.highlightBlock(block);
			});
			var data = "text/json;charset=utf-8," + encodeURIComponent(output);
			$('#download-output').attr('href', 'data:' + data);
			$('#download-output').attr('download', 'openapi.json');
		},

		renderOutputYaml: function () {
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
			$('pre code').each(function (i, block) {
				hljs.highlightBlock(block);
			});
			var data = "text/x-yaml;charset=utf-8," + encodeURIComponent(output);
			$('#download-yaml').attr('href', 'data:' + data);
			$('#download-yaml').attr('download', 'openapi.yaml');
		},

		scrollTop: function () {
			var elem = document.getElementById('scrollTop');
			elem.scrollIntoView();
		},

		save: function () {
			this.$root.save();
		},

		undo: function () {
			if (window.localStorage) {
				Vue.set(this.$root.container, 'openapi', JSON.parse(window.localStorage.getItem('openapi3')));
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
					Vue.delete(this.sd, 'authorizationUrl');
					Vue.delete(this.sd, 'tokenUrl');
					Vue.delete(this.sd, 'flow');
					Vue.delete(this.sd, 'scopes');
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
		}
	},
	methods : {
		removeSecurityDefinition : function(sdname) {
			this.$parent.removeSecurityDefinition(sdname);
		},
		addScope: function (sdName) {
			var secDef = this.openapi.securityDefinitions[sdName];
			if (!secDef.scopes) Vue.set(secDef, 'scopes',  {});
			if (!secDef.scopes.newScope) {
				Vue.set(secDef.scopes, 'newScope', 'description');
			}
		},
		renameScope : function(oldName, newName) {
			Vue.set(this.sd.scopes, newName, this.sd.scopes[oldName]);
			Vue.delete(this.sd.scopes, oldName);
		},
		removeScope: function (sdName, sName) {
			this.$root.save();
			Vue.delete(this.openapi.securityDefinitions[sdName].scopes, sName);
		}
	},
	data: function() {
		return {}
	}
});

Vue.component('api-scope', {
	props: ["sd", "sname", "sdname"],
	computed: {
		scopename: {
			get : function() {
				return this.sname;
			},
			set : function(newVal) {
				this.$parent.renameScope(this.sname, newVal);
			}
		} 
	},
	data: function() {
		return {}
	}
});
