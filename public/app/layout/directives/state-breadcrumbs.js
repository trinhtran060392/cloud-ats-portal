define(['layout/module'], function (module) {

  'use strict';
                                                 
  module.registerDirective('stateBreadcrumbs', ['$rootScope', '$compile', '$state', '$stateParams', function($rootScope, $compile, $state, $stateParams) {
    return {
      restrict: 'E',
      replace: true,
      template: '<ol class="breadcrumb"><li>Home</li></ol>',
      link: function(scope, element) {
        function setBreadcrumbs(breadcrumbs) {
          var html = '<li ng-click="goHome()" class="breadcrumb-clickable">{{getWord("Home")}}</li>';
          angular.forEach(breadcrumbs, function(crumb) {
            html += '<li ng-click="goTo($event)" class="breadcrumb-clickable">{{getWord("'+crumb+'")}}</li>';
          });

          element.html($compile(html)(scope));  
        }

        function fetchBreadcrumbs(stateName, breadcrumbs) {
          var state = $state.get(stateName);
          if (state && state.data && state.data.title && breadcrumbs.indexOf(state.data.title) == -1) {
            breadcrumbs.unshift(state.data.title);
          }

          var parentName = stateName.replace(/.?\w+$/, '');
          if (parentName) {
            return fetchBreadcrumbs(parentName, breadcrumbs);
          } else {
            return breadcrumbs;
          }
        }

        scope.goHome = function() {
          $state.go('app.dashboard');
        }

        scope.goTo = function(event) {
          
          var ele = event.currentTarget;
          var index = $(ele).index();

          var state_name = $state.current.name;
          var isPerformanceProject = undefined;
          if (state_name.indexOf('app.performance') > -1) {
            isPerformanceProject = true;
          } else if (state_name.indexOf('app.keyword') > -1){
            isPerformanceProject = false;
          }

          switch (isPerformanceProject) {
            case true: 
              var id = $stateParams.id;
              if (index === 1) {
                $state.go('app.performance', {id : id});
              } else if (index === 2) {
                var jobId = $stateParams.jobId;
                $state.go('app.performance.report', {id : id, jobId : jobId});
              }
              break;
            case false:
              var id = $stateParams.id;              
              if (index === 1) {
                $state.go('app.keyword', {id : id});
              }
              break;
            default: 
              break;
          }
        }

        function processState(state) {
          var breadcrumbs;
          if (state.data && state.data.breadcrumbs) {
            breadcrumbs = state.data.breadcrumbs;
          } else {
            breadcrumbs = fetchBreadcrumbs(state.name, []);
          }
          setBreadcrumbs(breadcrumbs);
        }

        processState($state.current);

        $rootScope.$on('$stateChangeStart', function(event, state) {
          processState(state);
        });
      }
    };
  }]);

});