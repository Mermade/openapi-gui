angular.module('components')
 
  .component('apiParameter', {
      templateUrl: 'src/parameter/parameter.html',
      bindings: {
        parameter: '=',
      },
      controller: function($scope, $element) {

        $scope.$watch( function() {
          return $scope.$ctrl.parameter.dataType;
        }, 
        function(newVal, oldVal) {
          $scope.$ctrl.complexDataType = $scope.$ctrl.isComplex();
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
          if ( this.parameter.dataType === 'object' ) {
            return true;
          }

          return false;
        }

        this.addSubParameter = function() {
          this.parameter.parameters.push( new Parameter('New Parameter') );
        }
      },
    }
  )