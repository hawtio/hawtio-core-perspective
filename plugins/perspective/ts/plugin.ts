/// <reference path="../../includes.ts"/>
/// <reference path="globals.ts"/>
/// <reference path="registry.ts"/>
module HawtioPerspective {

  export var _module = angular.module(HawtioPerspective.pluginName, []);

  _module.config(['$provide', ($provide) => {
    // Override the dummy service from hawtio-core-perspective
    $provide.decorator('HawtioPerspective', ['$delegate', ($delegate) => {
      return new RegistryImpl();
    }]);
  }]);

  export var perspectives = {
    currentPerspective: 'ex1',
    'ex1': ['ex1-1'],
    'ex2': ['ex2-2']
  };

  _module.run(['HawtioNav', '$templateCache', 'HawtioPerspective', (nav:HawtioMainNav.Registry, $templateCache:ng.ITemplateCacheService, perspectives:HawtioPerspective.Registry) => {
    log.debug("loaded");
    nav.add({
      id: 'perspective-menu',
      title: () => { return perspectives.getCurrent().label },
      template: () => { return $templateCache.get('plugins/perspective/html/menu.html'); },
      context: true
    });
    nav.on(HawtioMainNav.Actions.ADD, 'Perspective Decorator', (item:HawtioMainNav.NavItem) => {
      if (item.context) {
        return;
      }
      if (item.isValid === undefined) {
        item.isValid = () => { return true; };
      }
      var isValid = item.isValid;
      item.isValid = () => {
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
          includes.forEach((include) => {
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
        } else {
          answer = true;
        }
        if (answer && excludes) {
          excludes.forEach((exclude) => {
            if (!answer) {
              return;
            }
            if (exclude.id && exclude.id === item.id) {
              if (exclude.onCondition && angular.isFunction(exclude.onCondition)) {
                answer = exclude.onCondition();
              } else {
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
}
