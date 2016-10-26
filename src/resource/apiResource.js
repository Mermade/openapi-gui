angular.module('components')

.component('apiResource', {
    bindings: {
      resource: '=',
    },
    controller: function($scope) {

      /**
       * Remove a specific method from the array of methods associated
       * with this resource
       * 
       * @param  String methodId method identifier (e.g M123)
       * @return Void No return value
       */
      $scope.$on( 'deleteMethod', function(event, methodId) {
        var result = jQuery.grep($scope.$ctrl.resource.methods, function(value) {
          return value.id != methodId;
        });

        $scope.$ctrl.resource.methods = result;
      } );

      $scope.$on( 'duplicateMethod', function(event, methodToDuplicate) {
        method = new Method(methodToDuplicate.name) ;
        method.load(methodToDuplicate);
        this.resource.methods.push( method );
      } );

      this.addMethod = function() {
        this.resource.methods.push( new Method('newOperation') );
      }
    },
    templateUrl: 'src/resource/resource.html'
  }
)
