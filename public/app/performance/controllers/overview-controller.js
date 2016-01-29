define(['performance/module', 'lodash', 'notification'], function (module, _) {
  'use strict';

  module.registerController('OverviewPerformanceCtrl', 
    ['$scope', '$rootScope', '$stateParams', '$state', '$templateRequest', '$compile', 'PerformanceService', 'EventService',
    function($scope, $rootScope, $stateParams, $state, $templateRequest, $compile, PerformanceService, EventService) {

    	$scope.projectId = $stateParams.id;
      $scope.title = 'OVERVIEWS'
      PerformanceService.get($scope.projectId, function(response) {

        $scope.project = response;
        if (response.totalJob > 0) {
          var jobs = JSON.parse(response.jobs);
          $scope.project.jobs = jobs;
        } else $scope.project.jobs = [];
      });
      
      $scope.openJobReport = function (jobId) {
        $state.go('app.performance.report', {jobId : jobId});
      }
      
      var loadModal = function() {
        var $modal = $('#project-log');

        //clear modal content
        $modal.html('');

        $templateRequest('app/performance/views/overview-modal-content.tpl.html').then(function(template) {
          $modal.html($compile(template)($scope));
          $modal.modal('show');
        });
      };

      $scope.viewLog = function() {

        PerformanceService.log($scope.project._id, function (data, status) {
          if (status == 200) {
            var log = data.replace(/\u0000/g,'');
            $scope.project.log = log;
          }
          loadModal();
        });
      }

      var loadEditModal = function () {
        var $modal = $('#project-edittion');

        $modal.html('');
        $templateRequest('app/performance/views/project-edittion-modal-content.tpl.html').then(function (template) {

          $modal.html($compile(template)($scope));
          $modal.modal('show');
        });
      }

      $scope.edit = function () {
        loadEditModal();
        $scope.newName = angular.copy($scope.project.name);
      }

      var $project_name = $('#project-edittion').find('input');

      $('body').on('keypress', $project_name, function () {

      	var $element = $('#project-edittion').find('input');
      	if ($scope.newName != '' || $scope.newName != undefined) {

      		$element.parent().removeClass('has-error');
      	}
      });

      $scope.update = function (name) {
        
        var $modal = $('#project-edittion');
        if (!$scope.newName) {

        	$modal.find('.form-group').addClass('has-error');
        	$modal.find('.form-group').children().first().focus();
        	return;
        }

        PerformanceService.update($scope.projectId, name, function (data, status) {

          switch (status) {
            case 304:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Your project name does not change'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              break;
            case 202:
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('Your project has been updated'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              $scope.project.name = name;
              break;
            default:
              break;
          }
          $modal.modal('hide');
        });
      }

      $scope.delete = function () {
        $.SmartMessageBox({
            title: $rootScope.getWord("Delete project"),
            content: $rootScope.getWord("Are you sure to delete the project"),
            buttons: $rootScope.getWord('[No][Yes]')
          }, function (ButtonPressed) {
            if (ButtonPressed === "Yes" || ButtonPressed ==="はい") {

              PerformanceService.delete($scope.projectId, function (data, status) {
                if (status === 200) {
                  $.smallBox({
                    title: $rootScope.getWord("Notification"),
                    content: "<i class='fa fa-clock-o'></i> <i>"+$rootScope.getWord("The project has already deleted")+"</i>",
                    color: "#296191",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 4000
                  });

                  $state.go('app.projects');
                }
              });
            }
            if (ButtonPressed === "No") {
               return;
            }
        });
      }

      $scope.runLastScripts = function () {

        var selected = [];
        _.forEach($scope.project.lastScripts, function(sel) {
          selected.push(sel._id);
        });

        PerformanceService.run($scope.projectId, selected, function (data, status) {
          switch (status) {
            case 200:
              $scope.project.status = "RUNNING";
              $scope.project.log = undefined;
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('You have submitted project job'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              data.scripts = data.scripts.length;
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
          
        });
      }
      $scope.stopProject = function (projectId) {
        PerformanceService.stop(projectId, function (data, status) {
          if (status == 200) {
            $.smallBox({
              title: $rootScope.getWord('Notification'),
              content: $rootScope.getWord('Your project has been already stopped'),
              color: '#296191',
              iconSmall: 'fa fa-check bounce animated',
              timeout: 3000
            });
            $scope.project.isBuilding =false;
          }
        });
      }

      $scope.downloadJTL = function(projectId,jobId) {
        PerformanceService.download(projectId, jobId ,function (data,status) {
          var file = new Blob([data], {type: 'application/x-zip'});
          var link=document.createElement('a');
          link.href=window.URL.createObjectURL(file);
          link.download="jtl-file.zip";
          link.click();
        });
      }

      var updateStatus = function(msg) {
        $scope.$apply(function() {
          var job = JSON.parse(msg.data);
          if (job.project_id === $scope.projectId) {

            $scope.project.last_running = job.runningTime;
            $scope.project.status = job.project_status;
            $scope.project.log = job.log;
            $scope.project.isBuilding = job.isBuilding;

            if ($scope.project.status === 'READY') {
              $.smallBox({
                title: $rootScope.getWord('Notification'),
                content: $rootScope.getWord('The job ') + job._id + $rootScope.getWord(' has completed.'),
                color: '#296191',
                iconSmall: 'fa fa-check bounce animated',
                timeout: 3000
              });
              job.scripts = job.scripts.length;
              job.created_date = job.runningTime;
              if (job.report && job.report.length > 0) {
                $scope.project.jobs.unshift(job);
              }
              
            }
          }
        })
      }

      EventService.feed(updateStatus);

  	}]);
});