var app = angular.module('app', ['components'])
.controller('MainController', function() {
});

app.run(function($rootScope){
  var jptr = JsonPointer.noConflict();
});

app.config (function($locationProvider) {
    $locationProvider.html5Mode({
    enabled : true,
    requireBase: false,
    rewriteLinks : false
    });
});
