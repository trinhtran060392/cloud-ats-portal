define(['dashboard/module', 'lodash','morris'], function(module, _) {

  'use strict';

  module.registerController('DashboardCtrl', ['$scope','$state','KeywordService','PerformanceService','ReportService','ScriptService', 
    function($scope,$state,KeywordService,PerformanceService,ReportService,ScriptService) {

    $scope.recent_finished_projects = [];
    $scope.performance_projects = [];
    $scope.recent_projects = [];

  var getInfoProjects = function(data) {
    var topProject = [];

    _.forEach(data, function (item) {
      var totalCases = item.P+item.S+item.F;
      var percentPass = _.round((item.P/totalCases)*100,2);
      var percentFail = _.round((item.F/totalCases)*100,2);
      var infoProject = {
        _id : item._id,
        name : item.x,
        percentPass : percentPass,
        percentFail : percentFail,
        totalCases : totalCases
      };

      topProject.push(infoProject);
    })
    
    $scope.top_projects = topProject;
  }

  var loadDataReport = function(data,numberOfJobId) {
      var totalPass = 0;
      var totalFail = 0;
      var totalSkip = 0;
      var totalCases = 0;
      var projectName = data.projectName;
      var projectId = data.projectId;
      var dataObject = JSON.parse(data.suite_reports);
      _.forEach(dataObject, function (obj) {
        totalPass += obj.total_pass;
        totalFail += obj.total_fail;
        totalSkip += obj.total_skip;
      });

      var projectReport = {
        x : projectName,
        P : totalPass,
        F : totalFail,
        S : totalSkip,
        _id : projectId
      };

      $scope.recent_projects.push(projectReport);
      if($scope.recent_projects.length == numberOfJobId) {
        $scope.recent_finished_projects = $scope.recent_projects;
        getInfoProjects($scope.recent_finished_projects);

        if($scope.recent_finished_projects.length > 10) {
          var temp = $scope.recent_finished_projects;
          var size = temp.length - 10;
          $scope.recent_finished_projects.splice(10,size);
        }
      }
  }

  var sortJSON = function(data, key) {
      return data.sort(function (a, b) {
          var x = a[key];
          var y = b[key];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
  }

  var loadData = function() {
      var listProjects = [];
      var projectInfo = {};

      KeywordService.list(function (data,status) {
        listProjects = data;
        var countJobId = 0;
        _.forEach(listProjects, function (item,key) {
          var lastJobId = item.lastJobId;
          if(lastJobId === undefined) {
            countJobId ++;
          }
        })

        var listReports = [];
        _.forEach(listProjects, function (item,key) {
          var lastJobId = item.lastJobId;
          var numberOfJobId = listProjects.length - countJobId;
          if(lastJobId) {
            var projectId = item._id;
            var projectName = item.name;
            item.sort = key;
            KeywordService.getReport(projectId,lastJobId,function (dataReport,statusReport) {
              if(item.lastJobId == dataReport.functional_job_id) {
                dataReport.sort = item.sort;
                dataReport.projectName = projectName;
                dataReport.projectId = projectId;
                listReports.push(dataReport);
              }

              //sort list report
              if(numberOfJobId == listReports.length) {
                var sortListReports = sortJSON(listReports, 'sort');
                _.forEach(sortListReports, function (report) {
                  loadDataReport(report,numberOfJobId);
                })
              }
            });
          }
        })

      });

      //Load data for Performance project
      PerformanceService.projects(function (data) {
        var countJobId = 0;
        //listProjects is emptied
        listProjects = [];

        listProjects = data;

        _.forEach(listProjects, function (item,key) {
          var lastJobId = item.lastJobId;
          if(lastJobId === undefined) {
            countJobId ++;
          }
        })

        _.forEach(listProjects, function (item,key) {
          var lastJobId = item.lastJobId;
          if(lastJobId) {
            var projectId = item._id;
            var projectName = item.name;
            var scriptsId = item.lastScripts;
            var scripts = [];
            var users = 0;
            var ram_up = 0;
            var loops = 0;
            var duration = 0;
            var performanceProjects = [];
            var perf_projectInfo = {};
            var count = 0;

            _.forEach(scriptsId, function (scriptId) {
              ScriptService.get(projectId,scriptId._id,function (data,status) {
                count ++;
                users += data.number_threads;
                ram_up += data.ram_up;
                loops += data.loops;
                duration += data.duration;
                if(count === scriptsId.length) {
                  ReportService.report(projectId,lastJobId,function (data,status) {
                    if (status != 404) {
                      $scope.reports = data;
                      _.forEach($scope.reports, function (reports) {
                        _.forEach(reports, function (report) {
                          report.summary.error_percent = _.round(report.summary.error_percent,2);
                        });

                        // get data of summary report
                        $scope.summaryReport = _.find(reports, function (report) {
                          return report.label == "*SummaryReport*";
                        });

                        perf_projectInfo = {
                          _id : projectId,
                          projectName : projectName,
                          users : users,
                          ram_up : ram_up,
                          loops : loops,
                          duration : duration,
                          samples : $scope.summaryReport.summary.samples,
                          error_percent : $scope.summaryReport.summary.error_percent
                        };

                        if(perf_projectInfo.error_percent != 0 ) {
                          $scope.performance_projects.push(perf_projectInfo);
                        }

                      });
                    }
                    
                  });
                }
              });
            })

          }
        })
      });
    }

    loadData();

    $scope.redirectPerformance = function (projectId) {
      $state.go('app.performance', {id: projectId});
    }

    $scope.redirectKeyword = function (projectId) {
      $state.go('app.keyword', { id : projectId });
    }

    }
  ]);
});