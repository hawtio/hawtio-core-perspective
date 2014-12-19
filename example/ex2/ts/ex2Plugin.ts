/// <reference path="../../../plugins/includes.ts"/>
module Ex2 {
  var pluginName = 'ex2';
  var log:Logging.Logger = Logger.get(pluginName);
  export var _module = angular.module(pluginName, []);
  var templatePath = 'example/ex2/html';

  var tabs = [];

  _module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', ($locationProvider, $routeProvider, builder) => {
    $locationProvider.html5Mode(true);
    ['1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach((index) => {
      tabs.push(builder.create()
        .id('ex2-' + index)
        .title(() => { return 'Ex2 Page ' + index; })
        .href(() => { return '/ex2/' + index; })
        .build());
    });
    $routeProvider.when('/ex2/:page', { templateUrl: builder.join(templatePath, 'page.html') }); 
  }]);

  _module.run(['HawtioNav', 'HawtioPerspective', (HawtioNav, perspectives) => {
    tabs.forEach((tab) => HawtioNav.add(tab));
    perspectives.add('p2', {
      label: 'Perspective Two',
      isValid: () => true,
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
}
