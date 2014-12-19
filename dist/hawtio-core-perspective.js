

/// <reference path="../../includes.ts"/>
var HawtioPerspective;
(function (HawtioPerspective) {
    HawtioPerspective.pluginName = "hawtio-core-perspective";
    HawtioPerspective.log = Logger.get(HawtioPerspective.pluginName);
    HawtioPerspective.templatePath = "plugins/example/html";
})(HawtioPerspective || (HawtioPerspective = {}));

/// <reference path="../../includes.ts"/>
/// <reference path="globals.ts"/>
var HawtioPerspective;
(function (HawtioPerspective) {
    var RegistryImpl = (function () {
        function RegistryImpl() {
            this.perspectives = {};
            this.current = undefined;
            this.currentId = undefined;
            this.labels = [];
        }
        RegistryImpl.prototype.add = function (id, perspective) {
            this.perspectives[id] = perspective;
            if (!this.current) {
                this.setCurrent(id);
            }
        };
        RegistryImpl.prototype.remove = function (id) {
            var answer = this.perspectives[id];
            this.perspectives[id] = undefined;
            return answer;
        };
        RegistryImpl.prototype.setCurrent = function (id) {
            var current = this.perspectives[id];
            if (current) {
                this.current = current;
                this.currentId = id;
            }
        };
        RegistryImpl.prototype.getCurrent = function () {
            return this.current;
        };
        RegistryImpl.prototype.getLabels = function () {
            var _this = this;
            _.remove(this.labels, function (item) { return item.id === _this.currentId; });
            _.forOwn(this.perspectives, function (perspective, id) {
                if (id === _this.currentId) {
                    return;
                }
                if (perspective.isValid && angular.isFunction(perspective.isValid) && !perspective.isValid()) {
                    _.remove(_this.labels, id);
                    return;
                }
                if (_.any(_this.labels, function (item) { return id === item.id; })) {
                    // already present
                    return;
                }
                // was added
                _this.labels.push({
                    id: id,
                    $$hashKey: id,
                    label: perspective.label,
                    icon: perspective.icon
                });
            });
            return this.labels;
        };
        return RegistryImpl;
    })();
    HawtioPerspective.RegistryImpl = RegistryImpl;
})(HawtioPerspective || (HawtioPerspective = {}));

/// <reference path="../../includes.ts"/>
/// <reference path="globals.ts"/>
/// <reference path="registry.ts"/>
var HawtioPerspective;
(function (HawtioPerspective) {
    HawtioPerspective._module = angular.module(HawtioPerspective.pluginName, []);
    HawtioPerspective._module.config(['$provide', function ($provide) {
        // Override the dummy service from hawtio-core-perspective
        $provide.decorator('HawtioPerspective', ['$delegate', function ($delegate) {
            return new HawtioPerspective.RegistryImpl();
        }]);
    }]);
    HawtioPerspective.perspectives = {
        currentPerspective: 'ex1',
        'ex1': ['ex1-1'],
        'ex2': ['ex2-2']
    };
    HawtioPerspective._module.run(['HawtioNav', '$templateCache', 'HawtioPerspective', function (nav, $templateCache, perspectives) {
        HawtioPerspective.log.debug("loaded");
        nav.add({
            id: 'perspective-menu',
            title: function () {
                return perspectives.getCurrent().label;
            },
            template: function () {
                return $templateCache.get('plugins/perspective/html/menu.html');
            },
            context: true
        });
        nav.on(HawtioMainNav.Actions.ADD, 'Perspective Decorator', function (item) {
            if (item.context) {
                return;
            }
            if (item.isValid === undefined) {
                item.isValid = function () {
                    return true;
                };
            }
            var isValid = item.isValid;
            item.isValid = function () {
                if (!isValid()) {
                    return false;
                }
                var current = perspectives.getCurrent();
                if (!current || !current.tabs) {
                    return true;
                }
                var includes = current.tabs.includes;
                var excludes = current.tabs.excludes;
                var answer = false;
                if (includes) {
                    includes.forEach(function (include) {
                        if (answer) {
                            return;
                        }
                        if (include.id && include.id === item.id) {
                            if (include.onCondition && angular.isFunction(include.onCondition)) {
                                answer = include.onCondition();
                            }
                            return;
                        }
                        if (include.href && item.href) {
                            var href = item.href();
                            if (href.indexOf(include.href) === 0) {
                                answer = true;
                                return;
                            }
                        }
                    });
                }
                else {
                    answer = true;
                }
                if (answer && excludes) {
                    excludes.forEach(function (exclude) {
                        if (!answer) {
                            return;
                        }
                        if (exclude.id && exclude.id === item.id) {
                            if (exclude.onCondition && angular.isFunction(exclude.onCondition)) {
                                answer = exclude.onCondition();
                            }
                            else {
                                answer = false;
                            }
                        }
                        if (exclude.href && item.href) {
                            var href = item.href();
                            if (href.indexOf(exclude.href) === 0) {
                                answer = false;
                                return;
                            }
                        }
                    });
                }
                return answer;
            };
        });
    }]);
    hawtioPluginLoader.addModule(HawtioPerspective.pluginName);
})(HawtioPerspective || (HawtioPerspective = {}));

/// <reference path="plugin.ts"/>
var HawtioPerspective;
(function (HawtioPerspective) {
    var MenuController = HawtioPerspective._module.controller("HawtioPerspective.MenuController", ["$scope", "HawtioPerspective", function ($scope, perspectives) {
        $scope.perspectives = perspectives;
        $scope.setCurrent = function (id) {
            perspectives.setCurrent(id);
            $scope.$emit('hawtio-nav-redraw');
        };
    }]);
})(HawtioPerspective || (HawtioPerspective = {}));

angular.module("hawtio-core-perspective-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/perspective/html/menu.html","<li class=\"dropdown context\" ng-controller=\"HawtioPerspective.MenuController\">\n  <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n    {{perspectives.getCurrent().label}} <b class=\"caret\"></b>\n  </a>\n  <ul class=\"dropdown-menu\">\n    <li ng-repeat=\"perspective in perspectives.getLabels()\">\n      <a href=\"\" ng-click=\"setCurrent(perspective.id)\">{{perspective.label}}</a>\n    </li>\n  </ul>\n</li>\n");}]); hawtioPluginLoader.addModule("hawtio-core-perspective-templates");