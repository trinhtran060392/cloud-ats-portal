define(['keyword-upload/module'], function (module) {
  
  'use strict';

  module.registerController('ExecutionUploadCtrl', [
    '$rootScope','$scope', '$state', '$stateParams', 'SuiteService', 'KeywordUploadService',
    function($rootScope,$scope, $state, $stateParams, SuiteService, KeywordUploadService) {

      $scope.projectId = $stateParams.id;

      $scope.title = 'EXECUTION';

      var checkProjectStatus = function() {
        if ($scope.project.status == 'RUNNING') {
          $.SmartMessageBox({
            title: $rootScope.getWord('Project Execution Alert') +'!',
            content: $rootScope.getWord('Your project has been already running. Please back to overview tab to track project progress'),
            buttons: '['+$rootScope.getWord('Go to overview')+']'
          }, function (ButtonPressed) {
            if (ButtonPressed === $rootScope.getWord('Go to overview')) {
              $state.go('app.keyword-upload', {id: $scope.projectId});
            }
          });
          return false;
        }

        return true;
      }

      KeywordUploadService.get($scope.projectId, function(project) {
        $scope.project = project;
        checkProjectStatus();
      });

      $scope.run = function() {
        if (checkProjectStatus())

        KeywordUploadService.run($scope.projectId, function (data, status) {
          switch (status) {
            case 201:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('You have submitted project job'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              break;
            case 204:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Your project has been already running'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              break;
            default:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Can not submmit your project job'),
                color: '#c26565',
                iconSmall: 'fa fa-ban bounce animated',
                timeout: 3000
              });

          }
          $state.go('app.keyword-upload', {id:$scope.projectId});
        });
      }
  }]);
});