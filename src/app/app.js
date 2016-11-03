var app = angular.module('app', ['components', 'checklist-model'])
.controller('MainController', function() {
});

app.run(function($rootScope) {
});

app.config (function($locationProvider) {
    $locationProvider.html5Mode({
    enabled : true,
    requireBase: false,
    rewriteLinks : false
    });
});
