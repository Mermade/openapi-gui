var app = angular.module('app', ['components'])
.controller('MainController', function() {
});

app.run(function($rootScope){
  var jptr = JsonPointer.noConflict();
});
