/// <reference path="ex1Plugin.ts"/>
module Ex1 {

  var PageController = _module.controller('Ex1.PageController', ['$scope', '$routeParams', ($scope, $routeParams) => {
    $scope.page = $routeParams['page'];

  }]);

}
