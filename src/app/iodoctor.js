angular.module('components')
 
.component('ioDoctor', {
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

	  this.showResource = function(resource) {
		$location.hash(resource.id);
	  };
      
	  this.removeAll = function() {
	    bootbox.confirm('Remove all paths, are you sure?', function(result) {
          if (result) {
		    if (window.localStorage) window.localStorage.setItem('swagger2',JSON.stringify(apiConfig));
		    apiConfig.resources = [];
            $scope.$apply();
		  }
		});
      };

	  this.save = function() {
	    if (window.localStorage) {
		  window.localStorage.setItem('swagger2',JSON.stringify(this.apiConfig));
		}
	  };

	  this.undo = function() {
	    if (window.localStorage) {
		  this.apiConfig = JSON.parse(window.localStorage.getItem('swagger2'));
		}
	  };

	  this.scrollTop = function() {
	    var elem = document.getElementById('scrollTop');
		elem.scrollIntoView();
	  };

      this.loadSchema = function() {
        var schema;
		try {
		  schema = JSON.parse(this.importSchema);
		  bootbox.alert('JSON definition loaded successfully');
		}
		catch (ex) {
		  try {
		    schema = jsyaml.safeLoad(this.importSchema);
			bootbox.alert('YAML definition loaded successfully');
		  }
		  catch (ex) {
		    bootbox.alert('The definition could not be parsed');
		  }
		}

        this.apiConfig = schema;
		if (window.localStorage) window.localStorage.setItem('swagger2',JSON.stringify(schema));
		this.apiConfig.resources = [];

        angular.forEach(schema.paths, function(def, name) {
          resource = new Resource(name);
          resource.load(def, name, schema);
          this.push(resource);
        }, this.apiConfig.resources);
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
	    if (newName != oldName) {
	      this.apiConfig.securityDefinitions[newName] = this.apiConfig.securityDefinitions[oldName];
		  delete this.apiConfig.securityDefinitions[oldName];
		}
	  };

	  this.removeSecurityDefinition = function(sdName) {
		if (window.localStorage) window.localStorage.setItem('swagger2',JSON.stringify(apiConfig));
		delete this.apiConfig.securityDefinitions[sdName];
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

      this.renderOutput = function() {
        // Pretty print has an issue correctly rendering output when we modify
        // the content in an already "prettified" element. This hack creates a
        // new element so prettyPrint() will correctly re-render the output
        $('#json-output').html('<pre class="prettyprint" id="pretty-json"></pre>');
        output = JSON.stringify(this.transformConfig(), undefined, 4);
        $('#pretty-json').html( output );
        clippy = new Clipboard('#copy-json');
        prettyPrint();
		var data = "text/json;charset=utf-8," + encodeURIComponent(output);
		$('#download-output').attr('href','data:' + data);
		$('#download-output').attr('download','swagger.json');
      };

      this.renderOutputYaml = function() {
        $('#yaml-output').html('<pre class="prettyprint" id="pretty-yaml"></pre>');
        try {
		  output = jsyaml.dump(this.transformConfig());
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
      };

      this.transformConfig = function() {
        var transformedConfig = angular.extend({},this.apiConfig);
		transformedConfig.paths = {};

        angular.forEach(this.apiConfig.resources, function(resource) {
          transformedConfig.paths[resource.name] = resource.render();
        });

		delete transformedConfig.resources;
		delete transformedConfig.schemas;
		return transformedConfig;

      };
    },
    templateUrl: 'src/app/iodoctor.html'
  }
)
