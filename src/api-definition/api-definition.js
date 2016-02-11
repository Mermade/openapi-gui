angular.module('components')
 
.component('apiDefinition', {
    bindings: {
      config: '=',
    },
    controller: function($scope) {
    },
    templateUrl: 'src/api-definition/output.html',
    replace: true
  }
)