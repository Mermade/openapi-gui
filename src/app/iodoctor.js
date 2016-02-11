angular.module('components')
 
.component('ioDoctor', {
    controller: function() {
      this.importSchema = "";
      this.apiConfig = {
        resources: [ new Resource('New Resource') ],
        schemas: []
      };

      this.addResource = function() {
        this.apiConfig.resources.push( new Resource('New Resource') );
      }

      this.loadSchema = function() {
        var schema = JSON.parse( this.importSchema );

        this.apiConfig = {
          resources: []
        };

        angular.forEach(schema, function(def, name) {
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