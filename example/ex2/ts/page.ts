
/// <reference path="ex2Plugin.ts"/>
module Ex2 {

  var PageController = _module.controller('Ex2.PageController', ['$scope', '$routeParams', ($scope, $routeParams) => {
    $scope.page = $routeParams['page'];

  }]);

}
