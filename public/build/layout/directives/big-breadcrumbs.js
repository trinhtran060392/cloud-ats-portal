define(["layout/module","lodash"],function(a,b){"use strict";a.registerDirective("bigBreadcrumbs",function(){return{restrict:"E",replace:!0,template:'<div><h1 class="page-title txt-color-blueDark"></h1></div>',scope:{items:"=",icon:"@"},link:function(a,c){var d=b.first(a.items),e=a.icon||"home";c.find("h1").append('<i class="fa-fw fa fa-'+e+'"></i> '+d),b.rest(a.items).forEach(function(a){c.find("h1").append(" <span>> "+a+"</span>")})}}})});