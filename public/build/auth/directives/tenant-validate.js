define(["auth/module"],function(a){"use strict";a.registerDirective("tenantValidate",[function(){return{restrict:"A",link:function(a,b,c){b.on("blur",function(){null!=a.selectedTenant?a.chooseTenant=!1:(a.chooseTenant=!0,a.alert="You have to choose a tenant",b.parent().removeClass("state-success"),b.parent().addClass("state-error"))})}}}])});