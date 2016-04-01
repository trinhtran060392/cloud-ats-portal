define(['keyword/module', 'lodash', 'c3'], function (module, _, c3) {
  'use strict';

  module.registerController('SuiteReportCtrl', ['$scope', '$state', '$stateParams', 'KeywordService', function ($scope, $state, $stateParams, KeywordService) {
    
    $scope.jobId = $stateParams.jobId;
    $scope.suiteId = $stateParams.suiteId;
    $scope.projectId = $stateParams.id;
    $scope.suiteReportId = $stateParams.suiteReportId;
    $scope.case_reports = [];

    var getReport = function () {
      KeywordService.suiteReports($scope.projectId, $scope.jobId, $scope.suiteId, $scope.suiteReportId, function (response, status) {
        var data = response;
        _.forEach(data, function (obj) {
          if (obj.useDataDriven) {
            var caze = {
              data_source:[]
            };
            caze.name = obj.name;
            caze.case_id = obj.case_id;
            caze.useDataDriven = true;
            var dataset = _.filter(data, function (object) {
              return obj.case_id === object.case_id;
            });

            var failedCase = _.filter(dataset, function (set) {
              return set.isPass == false;
            });
            if (failedCase.length > 0) {
              caze.isPass = false;
            } else caze.isPass = true;
            caze.data_source = dataset;
            var index = _.find($scope.case_reports, function (tmp) {
              return tmp.case_id === caze.case_id;
            });

            if (!index) {
              $scope.case_reports.push(caze);
            }
          } else $scope.case_reports.push(obj);
        });
      });
    }

    KeywordService.lastestJobs($scope.projectId, $scope.jobId, $scope.suiteId, $scope.suiteReportId, function (data, status) {
      $scope.suites = JSON.parse(data.suites);
      var numberOfPassedCase = data.numberOfPassedCase;
      var numberOfFailedCase = data.numberOfFailedCase;
      var chart = c3.generate({
        bindto: "#chart",
        data: {
          // iris data from R
          columns: [
              ['Pass', numberOfPassedCase],
              ['Fail', numberOfFailedCase],
          ],
          colors:{
            Pass : '#00b4a0',
            Fail : '#ff5050'
          },
          type: 'pie',
          onclick: function (d, i) {
          },
          onmouseover: function (d, i) {},
          onmouseout: function (d, i) {}
        }
      });
    });

    getReport();
    $scope.redirectToTestCaseReport = function(id) {
      $state.go('app.keyword.report.suite.testcase', {'caseReportId': id});
    }

    $scope.goToJobReport = function (id) {
      $state.go('app.keyword.report', {'jobId' : id});
    }
  }]);
});