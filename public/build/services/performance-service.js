define(["layout/module"],function(a){"use strict";a.registerFactory("PerformanceService",["$http","$cookies",function(a,b){return{projects:function(c){var d={method:"GET",url:appConfig.RestEntry+"/api/v1/project/performances",headers:{"X-AUTH-TOKEN":b.get("authToken"),"X-SPACE":b.get("space")}};a(d).success(function(a,b){c(a)}).error(function(a,b){})},get:function(c,d){var e={method:"GET",url:appConfig.RestEntry+"/api/v1/project/performance/"+c,headers:{"X-AUTH-TOKEN":b.get("authToken"),"X-SPACE":b.get("space")}};a(e).success(function(a,b){d(a)}).error(function(a,b){})},create:function(c,d){var e={method:"POST",url:appConfig.RestEntry+"/api/v1/project/performance",headers:{"X-AUTH-TOKEN":b.get("authToken"),"X-SPACE":b.get("space")},data:{name:c}};a(e).success(function(a,b){d(a)}).error(function(a,b){})},update:function(c,d,e){var f={method:"PUT",url:appConfig.RestEntry+"/api/v1/project/performance",headers:{"X-AUTH-TOKEN":b.get("authToken"),"X-SPACE":b.get("space")},data:{name:d,id:c}};a(f).success(function(a,b){e(a,b)}).error(function(a,b){e(a,b)})},"delete":function(c,d){var e={method:"DELETE",url:appConfig.RestEntry+"/api/v1/project/performance",headers:{"X-AUTH-TOKEN":b.get("authToken"),"X-SPACE":b.get("space")},data:c};a(e).success(function(a,b){d(a,b)}).error(function(a,b){d(a,b)})},run:function(c,d,e){var f={method:"POST",url:appConfig.RestEntry+"/api/v1/project/performance/run/"+c,headers:{"X-AUTH-TOKEN":b.get("authToken"),"X-SPACE":b.get("space")},data:d};a(f).success(function(a,b){e(a,b)}).error(function(a,b){})},report:function(c){var d={method:"GET",url:appConfig.RestEntry+"/api/v1/project/performance/report",headers:{"X-AUTH-TOKEN":b.get("authToken"),"X-SPACE":b.get("space")}};a(d).success(function(a,b){c(a,b)}).error(function(a,b){})}}}])});