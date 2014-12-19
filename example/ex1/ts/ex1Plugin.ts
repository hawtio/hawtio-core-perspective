/// <reference path="../../includes.ts"/>
module Ex1 {
  var pluginName = 'ex1';
  var log:Logging.Logger = Logger.get(pluginName);
  export var _module = angular.module(pluginName, []);
  var templatePath = 'example/ex1/html';

  var tabs = [];

  _module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', ($locationProvider, $routeProvider, builder) => {
    $locationProvider.html5Mode(true);
    ['1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach((index) => {
      tabs.push(builder.create()
        .id('ex1-' + index)
        .title(() => { return 'Ex1 Page ' + index; })
        .href(() => { return '/ex1/' + index; })
        .build());
    });
    $routeProvider.when('/ex1/:page', { templateUrl: builder.join(templatePath, 'page.html') }); 
  }]);

  _module.run(['HawtioNav', 'HawtioPerspective', (HawtioNav, perspective) => {
    tabs.forEach((tab) => HawtioNav.add(tab));
    perspective.add('p1', {
      label: 'Perspective One',
      isValid: () => true,
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
}
