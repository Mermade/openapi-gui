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

        angular.forEach(schema.resources, function(def, name) {
          resource = new Resource(name);
          resource.load(def);
          this.push( resource );
        }, this.apiConfig.resources);
      }
    },
    templateUrl: 'src/app/iodoctor.html'
  }
)