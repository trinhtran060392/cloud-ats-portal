define(["keyword/module"],function(a){"use strict";a.registerController("ExecutionCtrl",["$scope","$state","$stateParams","SuiteService","KeywordService",function(a,b,c,d,e){a.projectId=c.id,a.title="EXECUTION";var f=[],g=function(){return"RUNNING"==a.project.status?($.SmartMessageBox({title:"Project Execution Alert!",content:"Your project has been already running. Please back to overivew tab to track project progress",buttons:"[Go to overview]"},function(c){"Go to overview"===c&&b.go("app.keyword",{id:a.projectId})}),!1):!0};e.get(a.projectId,function(b){a.project=b,g()}),d.list(a.projectId,function(b){a.suites=b}),a.selectSuite=function(a){var b=$(".btn.btn-primary.btn-keyword-run");-1!=_.indexOf(f,a)?_.remove(f,function(b){return b==a}):f.push(a),f.length>0?b.removeClass("disabled"):b.addClass("disabled")},a.run=function(){g()&&e.run(a.projectId,f,function(c,d){switch(d){case 201:$.smallBox({title:"Notification",content:"You have submitted project job",color:"#296191",iconSmall:"fa fa-check bounce animated",timeout:3e3});break;case 204:$.smallBox({title:"Notification",content:"Your project has been already running",color:"#296191",iconSmall:"fa fa-check bounce animated",timeout:3e3});break;default:$.smallBox({title:"Notification",content:"Can not submmit your project job",color:"#c26565",iconSmall:"fa fa-ban bounce animated",timeout:3e3})}b.go("app.keyword",{id:a.projectId})})}}])});