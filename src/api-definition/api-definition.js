angular.module('components')
 
.component('apiDefinition', {
    bindings: {
      config: '=',
    },
    controller: function($scope) {
      this.output = '';

      $scope.$watch('config', function(newVal, oldVal){
          console.log('changed');
      }, true);

      this.renderOutput = function() {
        // Pretty print has an issue correctly rendering output when we modify
        // the content in an already "prettified" element. This hack creates a
        // new element so prettyPrint() will correctly re-render the output
        $('#json-output').html('<pre class="prettyprint" id="pretty-json"></pre>');
        this.output = JSON.stringify(this.transformConfig(), undefined, 4);
        $('#pretty-json').html( this.output );
        clippy = new Clipboard('#copy-output');
        prettyPrint();
      }

      this.transformConfig = function() {
        var transformedConfig = {
          schema: {},
          resources: {},
        };

        angular.forEach(this.config.resources, function(resource) {
          transformedConfig.resources[resource.name] = resource.render();
        });

        return transformedConfig;

      };
    },
    templateUrl: 'src/api-definition/output.html',
    replace: true
  }
)