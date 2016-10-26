angular.module('components')
 
.component('apiYaml', {
    bindings: {
      config: '=',
    },
    controller: function($scope) {
    },
    templateUrl: 'src/api-yaml/output.html',
    replace: true
  }
)
