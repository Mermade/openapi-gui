angular.module('components')
 
.component('ioDoctor', {
    controller: function() {
      this.importSchema = "";
      this.apiConfig = {
	    swagger: "2.0",
        resources: [ new Resource('/') ],
        schemas: []
      };

      this.addResource = function() {
        this.apiConfig.resources.push( new Resource('/newPath') );
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
			alert('YAML definiton loaded successfully');
		  }
		  catch (ex) {
		    alert('The definition could not be parsed');
		  }
		}

        this.apiConfig = {
          resources: []
        };

        angular.forEach(schema.paths, function(def, name) {
          resource = new Resource(name);
          resource.load(def);
          this.push( resource );
        }, this.apiConfig.resources);
      }

      this.renderOutput = function() {
        // Pretty print has an issue correctly rendering output when we modify
        // the content in an already "prettified" element. This hack creates a
        // new element so prettyPrint() will correctly re-render the output
        $('#json-output').html('<pre class="prettyprint" id="pretty-json"></pre>');
        output = JSON.stringify(this.transformConfig(), undefined, 4);
        $('#pretty-json').html( output );
        clippy = new Clipboard('#copy-output');
        prettyPrint();
      }

      this.renderOutputYaml = function() {
        $('#yaml-output').html('<pre class="prettyprint" id="pretty-yaml"></pre>');
        output = jsyaml.safeDump(this.transformConfig());
        $('#pretty-yaml').html( output );
        clippy = new Clipboard('#copy-output');
        prettyPrint();
      }

      this.transformConfig = function() {
        var transformedConfig = {};

        angular.forEach(this.apiConfig.resources, function(resource) {
          transformedConfig[resource.name] = resource.render();
        });

        return transformedConfig;

      };
    },
    templateUrl: 'src/app/iodoctor.html'
  }
)
