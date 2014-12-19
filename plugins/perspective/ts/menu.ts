/// <reference path="plugin.ts"/>
module HawtioPerspective {

  var MenuController = _module.controller("HawtioPerspective.MenuController", ["$scope", "HawtioPerspective", ($scope, perspectives) => {
    $scope.perspectives = perspectives
    $scope.setCurrent = (id) => {
      perspectives.setCurrent(id);
      $scope.$emit('hawtio-nav-redraw');
    }
  }]);

}
