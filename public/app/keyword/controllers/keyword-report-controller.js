define(['keyword/module', 'lodash'], function (module, _) {
  'use strict';
  module.registerController('KeywordReportCtrl', 
    ['$scope', '$rootScope', '$state', '$stateParams', '$templateRequest', '$compile', '$cookies', 'KeywordService',
    function($scope, $rootScope, $state, $stateParams, $templateRequest, $compile, $cookies, KeywordService) {

      $scope.projectId = $stateParams.id;

      $scope.jobId = $stateParams.jobId;

      $scope.title = 'REPORTS';
      
      $scope.suiteReports = [];

      $scope.listSuiteReports = [];

      $scope.dataReports = [];

      var getDataReport = function(data) {

        _.forEach(data,function(obj,key) {
            var dataReport = {
              x : obj.name,
              P : obj.totalPass,
              F : obj.totalFail,
              S : obj.totalSkip
            };
            $scope.dataReports.push(dataReport);

        })
        $scope.listSuiteReports = $scope.dataReports;
      };

      KeywordService.getReport($scope.projectId, $scope.jobId, function(data,status) {
          if(status === 404) {
            $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord("Report not found"),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
          } else {
              _.forEach(data, function (obj) {
              if (obj.totalFail === 0) {
                obj.test_result = 'Pass';
              } else obj.test_result = 'Fail';
            });
            $scope.suiteReports = data;
            getDataReport(data);
          }
      });

      $scope.redirectToSuiteReport = function(suiteId, suiteReportId) {
        $state.go('app.keyword.report.suite', {'suiteId': suiteId, 'suiteReportId': suiteReportId});
      }

      $scope.redirectToOverview = function () {
        $state.go('app.keyword', {'id': $scope.projectId});
      }

      var loadModal = function() {
        var $modal = $('#project-log');

        //clear modal content
        $modal.html('');

        $templateRequest('app/keyword/views/overview-modal-content.tpl.html').then(function(template) {
          $modal.html($compile(template)($scope));
          $modal.modal('show');
        });
      };

      $scope.project = {};
      $scope.viewLog = function () {
        KeywordService.jobLog($scope.projectId, $scope.jobId, function (data, status) {
          if (status == 200) {
            $scope.project.log = data;
          }
          loadModal();
        });
      }
  }]);
});