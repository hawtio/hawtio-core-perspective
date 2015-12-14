/// <reference path="../libs/hawtio-core-dts/logger.d.ts"/>
/// <reference path="../libs/hawtio-core-dts/jquery.d.ts"/>
/// <reference path="../libs/hawtio-core-dts/angular.d.ts"/>
/// <reference path="../libs/hawtio-core-dts/angular-resource.d.ts"/>
/// <reference path="../libs/hawtio-core-dts/hawtio-core.d.ts"/>
/// <reference path="../libs/hawtio-core-dts/angular-route.d.ts"/>
/// <reference path="../libs/hawtio-core-dts/hawtio-core-navigation.d.ts"/>

/// <reference path="../../includes.ts"/>
var Ex1;
(function (Ex1) {
    var pluginName = 'ex1';
    var log = Logger.get(pluginName);
    Ex1._module = angular.module(pluginName, []);
    var templatePath = 'example/ex1/html';
    var tabs = [];
    Ex1._module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', function ($locationProvider, $routeProvider, builder) {
            $locationProvider.html5Mode(true);
            ['1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach(function (index) {
                tabs.push(builder.create()
                    .id('ex1-' + index)
                    .title(function () { return 'Ex1 Page ' + index; })
                    .href(function () { return '/ex1/' + index; })
                    .build());
            });
            $routeProvider.when('/ex1/:page', { templateUrl: builder.join(templatePath, 'page.html') });
        }]);
    Ex1._module.run(['HawtioNav', 'HawtioPerspective', function (HawtioNav, perspective) {
            tabs.forEach(function (tab) { return HawtioNav.add(tab); });
            perspective.add('p1', {
                label: 'Perspective One',
                isValid: function () { return true; },
                lastPage: '#/ex1/5',
                icon: undefined,
                tabs: {
                    includes: [{
                            href: '/ex1'
                        }]
                }
            });
        }]);
    hawtioPluginLoader.addModule(pluginName);
})(Ex1 || (Ex1 = {}));

/// <reference path="ex1Plugin.ts"/>
var Ex1;
(function (Ex1) {
    var PageController = Ex1._module.controller('Ex1.PageController', ['$scope', '$routeParams', function ($scope, $routeParams) {
            $scope.page = $routeParams['page'];
        }]);
})(Ex1 || (Ex1 = {}));

/// <reference path="../../../plugins/includes.ts"/>
var Ex2;
(function (Ex2) {
    var pluginName = 'ex2';
    var log = Logger.get(pluginName);
    Ex2._module = angular.module(pluginName, []);
    var templatePath = 'example/ex2/html';
    var tabs = [];
    Ex2._module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', function ($locationProvider, $routeProvider, builder) {
            $locationProvider.html5Mode(true);
            ['1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach(function (index) {
                tabs.push(builder.create()
                    .id('ex2-' + index)
                    .title(function () { return 'Ex2 Page ' + index; })
                    .href(function () { return '/ex2/' + index; })
                    .build());
            });
            $routeProvider.when('/ex2/:page', { templateUrl: builder.join(templatePath, 'page.html') });
        }]);
    Ex2._module.run(['HawtioNav', 'HawtioPerspective', function (HawtioNav, perspectives) {
            tabs.forEach(function (tab) { return HawtioNav.add(tab); });
            perspectives.add('p2', {
                label: 'Perspective Two',
                isValid: function () { return true; },
                lastPage: '#/ex2/3',
                icon: undefined,
                tabs: {
                    includes: [{
                            href: '/ex2'
                        }]
                }
            });
        }]);
    hawtioPluginLoader.addModule(pluginName);
})(Ex2 || (Ex2 = {}));

/// <reference path="ex2Plugin.ts"/>
var Ex2;
(function (Ex2) {
    var PageController = Ex2._module.controller('Ex2.PageController', ['$scope', '$routeParams', function ($scope, $routeParams) {
            $scope.page = $routeParams['page'];
        }]);
})(Ex2 || (Ex2 = {}));

angular.module("example-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("example/ex1/html/page.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Ex1.PageController\">\n    <h1>Ex1 Page {{page}}</h1>\n  </div>\n</div>\n");
$templateCache.put("example/ex2/html/page.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"Ex2.PageController\">\n    <h1>Ex2 Page {{page}}</h1>\n  </div>\n</div>\n");}]); hawtioPluginLoader.addModule("example-templates");