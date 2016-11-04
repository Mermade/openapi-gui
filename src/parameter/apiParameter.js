angular.module('components')
 
.component('apiParameter', {
    templateUrl: 'src/parameter/parameter.html',
    bindings: {
      parameter: '=',
    },
    controller: function($scope, $element) {

      /**
       * Remove a specific parameter from the array of parameters associated
       * with this property
       * 
       * @param  String parameterId parameter identifier (e.g P123)
       * @return Void No return value
       */
      $scope.$on( 'deleteProperty', function(event, propertyId) {
        var result = jQuery.grep($scope.$ctrl.parameter.properties, function(value) {
          return value.id != propertyId;
        });

        $scope.$ctrl.parameter.properties = result;
      } );

      //return $scope.$ctrl.parameter.type;
      $scope.$watch('$ctrl.parameter.type', function(newVal, oldVal) {
        $scope.$ctrl.isComplexDataType = $scope.$ctrl.isComplex();
	    this.parameter.availableFormats = this.parameter.availableFormatsFor(newVal);
      });

      this.getCollapseTarget = function () {
        return '#'+this.parameter.id;
      }

      this.toggleBodyDisplay = function() {
        $element.collapse('toggle');
      }

      this.delete = function($element) {
        $scope.$emit('deleteParameter', $element.$ctrl.parameter.id);
      }

      this.isComplex = function() {
        if ( this.parameter.type === 'object' || 
             this.parameter.type === 'array' ) {
          return true;
        }

        return false;
      }

      this.addProperty = function() {
        this.parameter.properties.push( new Property('New Property') );
      }
    },
  }
)
