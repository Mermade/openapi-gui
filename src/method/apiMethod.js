angular.module('components')

.component('apiMethod', {
    bindings: {
      method: '=',
    },
    controller: function($scope, $element) {

      /**
       * Remove a specific parameter from the array of parameters associated
       * with this method
       * 
       * @param  String parameterId parameter identifier (e.g P123)
       * @return Void No return value
       */
      $scope.$on( 'deleteParameter', function(event, parameterId) {
        var result = jQuery.grep($scope.$ctrl.method.parameters, function(value) {
          return value.id != parameterId;
        });

        $scope.$ctrl.method.parameters = result;
      } );

      this.deleteMethod = function($element) {
        $scope.$emit('deleteMethod', $element.$ctrl.method.id);
      }

      this.duplicateMethod = function($element) {
        $scope.$emit('duplicateMethod', $element.$ctrl.method);
      }

      this.addParameter = function() {
        this.method.parameters.push( new Parameter('newParameter') );
      }

    },
    templateUrl: 'src/method/method.html',
    replace: true
  }
)
