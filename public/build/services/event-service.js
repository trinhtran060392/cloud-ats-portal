define(["app"],function(a){"use strict";a.factory("EventService",["$http","$cookies","$rootScope","$window",function(a,b,c,d){var e=function(){var c=b.get("authToken"),d={method:"GET",url:appConfig.RestEntry+"/api/v1/event/close/"+c};a(d).success(function(a,b){})},f=function(){var a=b.get("authToken"),f=void 0===c.feed?new EventSource(appConfig.RestEntry+"/api/v1/event/feed/"+a):c.feed;return c.feed=f,d.onbeforeunload=function(a){e()},f};return{feed:function(a){var b=f();b.addEventListener("message",a,!1)}}}])});