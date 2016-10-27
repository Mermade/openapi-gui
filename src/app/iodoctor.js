angular.module('components')
 
.component('ioDoctor', {
    controller: function($scope, $rootScope) {
      this.importSchema = "";

	  this.apiConfig = angular.copy(petstore);
	  this.apiConfig.resources = [];
	  this.apiConfig.schemas = [];
	  var apiConfig = this.apiConfig;

      angular.forEach(petstore.paths, function(def, name) {
        resource = new Resource(name);
        resource.load(def, name);
        this.push( resource );
      }, this.apiConfig.resources);

      this.addResource = function() {
        this.apiConfig.resources.push( new Resource('/newPath') );
      }
      
	  this.removeAll = function() {
        this.apiConfig.resources = [];
      }

      this.loadSchema = function() {
        var schema;
		try {
		  schema = JSON.parse( this.importSchema );
		  alert('JSON definition loaded successfully');
		}
		catch (ex) {
		  try {
		    schema = jsyaml.safeLoad( this.importSchema );
			alert('YAML definition loaded successfully');
		  }
		  catch (ex) {
		    alert('The definition could not be parsed');
		  }
		}

        this.apiConfig = schema;
		this.apiConfig.resources = [];

        angular.forEach(schema.paths, function(def, name) {
          resource = new Resource(name);
          resource.load(def);
          this.push( resource );
        }, this.apiConfig.resources);
      }

	  $rootScope.$on('removeResource', function(event, id) {
		var result = jQuery.grep(apiConfig.resources, function(value) {
		  return value.id != id;
		});

	    apiConfig.resources = result;
	  });

      this.renderOutput = function() {
        // Pretty print has an issue correctly rendering output when we modify
        // the content in an already "prettified" element. This hack creates a
        // new element so prettyPrint() will correctly re-render the output
        $('#json-output').html('<pre class="prettyprint" id="pretty-json"></pre>');
        output = JSON.stringify(this.transformConfig(), undefined, 4);
        $('#pretty-json').html( output );
        clippy = new Clipboard('#copy-output');
        prettyPrint();
		var data = "text/json;charset=utf-8," + encodeURIComponent(output);
		$('#download-output').attr('href','data:' + data);
		$('#download-output').attr('download','swagger.json');
      }

      this.renderOutputYaml = function() {
        $('#yaml-output').html('<pre class="prettyprint" id="pretty-yaml"></pre>');
        try {
		  output = jsyaml.dump(this.transformConfig());
		}
		catch (ex) {
		  alert(ex.message);
		}
        $('#pretty-yaml').html( output );
        clippy = new Clipboard('#copy-output');
        prettyPrint();
		var data = "text/x-yaml;charset=utf-8," + encodeURIComponent(output);
		$('#download-yaml').attr('href','data:' + data);
		$('#download-yaml').attr('download','swagger.yaml');
      }

      this.transformConfig = function() {
        var transformedConfig = angular.copy(this.apiConfig);
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
