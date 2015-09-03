define(["angular","angular-couch-potato","angular-ui-router"],function(a,b){"use strict";var c=a.module("app.layout",["ui.router"]);return b.configureApp(c),c.config(["$stateProvider","$couchPotatoProvider","$urlRouterProvider",function(a,b,c){a.state("app",{"abstract":!0,views:{root:{templateUrl:"build/layout/layout.tpl.html",resolve:{deps:b.resolveDependencies(["auth/directives/login-info","auth/controllers/logout-controller","layout/actions/minify-menu","layout/actions/toggle-menu","layout/actions/full-screen","layout/actions/reset-widgets","layout/directives/smart-menu","layout/directives/state-breadcrumbs","layout/directives/search-autocomplete","layout/directives/smart-projects-active","layout/directives/list-space"])}}}}),c.otherwise(function(a,b){var c=a.get("$state");c.go("app.dashboard")}),c.rule(function(a,b){var c=b.path(),d="/"===c[c.length-1];if(d){var e=c.substr(0,c.length-1);return e}})}]),c.run(["$couchPotato",function(a){c.lazy=a}]),c});