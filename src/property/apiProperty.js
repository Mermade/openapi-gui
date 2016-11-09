angular.module('components')
 
.component('apiProperty', {
    templateUrl: 'src/property/property.html',
    bindings: {
      property: '=',
    },
    controller: function($scope, $element) {

      /**
       * Remove a specific property from the array of properties associated
       * with this property
       * 
       * @param  String propertyId property identifier
       * @return Void No return value
       */
      $scope.$on( 'deleteProperty', function(event, propertyId) {
        var result = jQuery.grep($scope.$ctrl.property.properties, function(value) {
          return value.id != propertyId;
        });

        $scope.$ctrl.property.properties = result;
      } );

      $scope.$watch('$ctrl.property.type', function(newVal, oldVal) {
        $scope.$ctrl.isComplexDataType = $scope.$ctrl.isComplex();
      });

      $scope.$watch('$ctrl.property.arrayType', function(newVal, oldVal) {
        $scope.$ctrl.isComplexDataType = $scope.$ctrl.isComplex();
      });

      this.delete = function($element) {
        $scope.$emit('deleteProperty', $element.$ctrl.property.id);
      }

      this.isComplex = function() {
        if ( this.property.type === 'object' || 
             this.property.type === 'array' ) {
          return true;
        }

        return false;
      }

      this.addSubProperty = function() {
        this.property.properties.push( new Property('New property') );
      }
    },
  }
)
