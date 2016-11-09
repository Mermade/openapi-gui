Vue.component('gui-main', {
	props: ['openapi', 'importSchema'],
	data: function() {
		return {}
	},
	methods: {

	  showResource : function(key) {
			var target = 'resource_'+Skey.split('/').join('').split('{').join('').split('}').join('');
			document.getElementById(target).scrollIntoView();
	  },

		removeAll: function () {
			bootbox.confirm('Remove all paths, methods and parameters, are you sure?', function (result) {
				if (result) {
					if (window.localStorage) window.localStorage.setItem('swagger2', JSON.stringify(this.openapi));
					this.openapi.paths = {};
				}
			});
		},

		loadSchema: function () {
			var schema;
			try {
				schema = JSON.parse(this.importSchema);
				bootbox.alert('JSON definition loaded successfully');
			}
			catch (ex) {
				try {
					schema = jsyaml.safeLoad(this.importSchema);
					bootbox.alert('YAML/blank definition loaded successfully');
				}
				catch (ex) {
					bootbox.alert('The definition could not be parsed');
				}
			}

			this.openapi = schema;
			if (window.localStorage) window.localStorage.setItem('swagger2', JSON.stringify(schema));
			this.openapi = postProcessDefinition(this.openapi);
		},

  	renderOutput : function() {
        // Pretty print has an issue correctly rendering output when we modify
        // the content in an already "prettified" element. This hack creates a
        // new element so prettyPrint() will correctly re-render the output
        $('#json-output').html('<pre class="prettyprint" id="pretty-json"></pre>');
        output = JSON.stringify(this.openapi, null, 4);
        $('#pretty-json').html( output );
        clippy = new Clipboard('#copy-json');
        prettyPrint();
				var data = "text/json;charset=utf-8," + encodeURIComponent(output);
				$('#download-output').attr('href','data:' + data);
				$('#download-output').attr('download','swagger.json');
      },

    	renderOutputYaml : function() {
        $('#yaml-output').html('<pre class="prettyprint" id="pretty-yaml"></pre>');
        try {
					output = jsyaml.dump(this.openapi);
				}
				catch (ex) {
					alert(ex.message);
				}
        $('#pretty-yaml').html( output );
        clippy = new Clipboard('#copy-yaml');
        prettyPrint();
				var data = "text/x-yaml;charset=utf-8," + encodeURIComponent(output);
				$('#download-yaml').attr('href','data:' + data);
				$('#download-yaml').attr('download','swagger.yaml');
      },

			scrollTop : function() {
	    	var elem = document.getElementById('scrollTop');
				elem.scrollIntoView();
	  	},

	  	save : function() {
				if (window.localStorage) {
					window.localStorage.setItem('swagger2',JSON.stringify(this.openapi));
				}
			},

	  	undo : function() {
				if (window.localStorage) {
					this.openapi = JSON.parse(window.localStorage.getItem('swagger2'));
				}
			}

	},
	template: '#template-gui-main'
});

/*

    controller: function($scope, $rootScope, $timeout, $location) {
      this.importSchema = "";

	  if ((window.localStorage) && (window.localStorage.getItem('swagger2'))) {
	    try {
		  this.apiConfig = JSON.parse(window.localStorage.getItem('swagger2'));
		}
		catch (ex) {}
	  }
	  else {
	    this.apiConfig = angular.extend({},petstore);
	  }
	  this.importSchema = JSON.stringify(this.apiConfig,null,2);

	  this.apiConfig.resources = [];
	  this.apiConfig.schemas = [];
	  this.schemes = ['http','https','soap'];
	  var apiConfig = this.apiConfig;

      angular.forEach(apiConfig.paths, function(def, name) {
        resource = new Resource(name);
        resource.load(def, name, apiConfig);
        this.push(resource);
      }, this.apiConfig.resources);

      this.addResource = function() {
	    var newResource = new Resource('/newPath');
        this.apiConfig.resources.push(newResource);
		$location.hash(newResource.id);
      };
      
	  $rootScope.$on('removeResource', function(event, id) {
		if (window.localStorage) window.localStorage.setItem('swagger2',JSON.stringify(apiConfig));
		var result = jQuery.grep(apiConfig.resources, function(value) {
		  return value.id != id;
		});
	    apiConfig.resources = result;
	  });

	  this.addTag = function() {
	    var newTag = { name: 'New Tag', description: 'Description' };
		if (!this.apiConfig.tags) {
			this.apiConfig.tags = [];
		}
	    this.apiConfig.tags.push(newTag);
	  };

	  this.removeTag = function(tag) {
	    var index = this.apiConfig.tags.indexOf(tag);
		if (index>=0) {
		  if (window.localStorage) window.localStorage.setItem('swagger2',JSON.stringify(apiConfig));
		  this.apiConfig.tags.splice(index,1);
		}
	  };

	  this.addSecurityDefinition = function() {
	    var newSD = { name: 'newSecurity', type: 'apiKey', description: 'Description' };
		if (!this.apiConfig.securityDefinitions) {
			this.apiConfig.securityDefinitions = {};
		}
	    this.apiConfig.securityDefinitions['newSecurity'] = newSD;
	  };

	  this.renameSecurityDefinition = function(oldName, newName) {
	    if ((newName != oldName) && (newName != '')) {
	      this.apiConfig.securityDefinitions[newName] = this.apiConfig.securityDefinitions[oldName];
		  delete this.apiConfig.securityDefinitions[oldName];
		}
	  };

	  this.getApplyAll = function(sdName) {
		for (var s in this.apiConfig.security) {
		  var entry = this.apiConfig.security[s];
		  if (typeof entry[sdName] !== 'undefined') return true;
		}
	    return false;
	  };

	  this.toggleApplyAll = function(sdName) {
	    if (!this.apiConfig.security) this.apiConfig.security = [];
		var present = this.getApplyAll(sdName);
		if (present) {
		  for (var s in this.apiConfig.security) {
		    var entry = this.apiConfig.security[s];
			if (entry[sdName]) this.apiConfig.security.splice(s,1);
		  }
		}
		else {
		  var entry = {};
		  entry[sdName] = [];
		  if (this.apiConfig.securityDefinitions[sdName].type == 'oauth2') {
		    for (var s in this.apiConfig.securityDefinitions[sdName].scopes) {
			  entry[sdName].push(s);
			}
		  }
		  this.apiConfig.security.push(entry);
		}
	  };

	  this.removeSecurityDefinition = function(sdName) {
		if (window.localStorage) window.localStorage.setItem('swagger2',JSON.stringify(apiConfig));
		delete this.apiConfig.securityDefinitions[sdName];
		if (this.getApplyAll(sdName)) {
		  this.toggleApplyAll(sdName);
		}
	  };

	  this.addScope = function(sdName) {
		if (!this.apiConfig.securityDefinitions[sdName].scopes) {
			this.apiConfig.securityDefinitions[sdName].scopes = {};
		}
	    this.apiConfig.securityDefinitions[sdName].scopes['newScope'] = 'Description';
	  };

	  this.renameScope = function(sdName, oldName, newName) {
	    if (newName != oldName) {
	      this.apiConfig.securityDefinitions[sdName].scopes[newName] = this.apiConfig.securityDefinitions[sdName].scopes[oldName];
		  delete this.apiConfig.securityDefinitions[sdName].scopes[oldName];
		}
	  };

	  this.removeScope = function(sdName, sName) {
		if (window.localStorage) window.localStorage.setItem('swagger2',JSON.stringify(apiConfig));
		delete this.apiConfig.securityDefinitions[sdName].scopes[sName];
	  };

)};
*/

