define(["performance/module","lodash","notification"],function(a,b){"use strict";a.registerController("CreateScriptCtrl",["$scope","$stateParams","$templateRequest","$compile","PerformanceService","ScriptService",function(a,c,d,e,f,g){a.projectId=c.id,a.script={ram_up:5,number_threads:1,duration:0,loops:1,samplers:[]},a.selected={method:"GET",constant_time:0,arguments:[{paramName:"",paramValue:""}]},$("body").on("keypress",'.name-script textarea[name="text-area-script"]',function(){$(this).parent().removeClass("has-error")}),a.clickSaveScript=function(){b.forEach(a.script.samplers,function(a){b.remove(a.arguments,function(a){return""==a.paramName||""==a.paramValue})});var d=$("#createScript"),e=$(".script-name").find(".text-area-script");return a.script.name?void g.createScript(a.script,c.id,function(b){null!=b&&(a.script._id=b._id,$.smallBox({title:"The script has created",content:"<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",color:"#296191",iconSmall:"fa fa-check bounce animated",timeout:4e3}),a.scripts.push(b),d.modal("hide"))}):void e.parent().addClass("has-error")},a.deleteScript=function(c){g["delete"](a.projectId,c._id,function(d,e){202==e&&($.smallBox({title:"The script has deleted",content:"<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",color:"#296191",iconSmall:"fa fa-check bounce animated",timeout:4e3}),b.remove(a.scripts,function(a){return a._id===c._id}))})},a.clickUpdateScript=function(){g.update(a.projectId,a.script,function(c,d){switch(d){case 202:$.smallBox({title:"The script has updated",content:"<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",color:"#296191",iconSmall:"fa fa-check bounce animated",timeout:4e3}),b.remove(a.scripts,function(b){return b._id==a.script._id}),a.scripts.push(a.script);break;case 204:$.smallBox({title:"The script has nothing to update",content:"<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",color:"#296191",iconSmall:"fa fa-check bounce animated",timeout:4e3});break;case 400:$.smallBox({title:"The script is not exist",content:"<i class='fa fa-clock-o'></i> <i>1 seconds ago...</i>",color:"#296191",iconSmall:"fa fa-check bounce animated",timeout:4e3})}})};$('.name-sampler input[name="name"'),$('.sampler-url input[name="url"');$("body").on("keypress",'.name-sampler input[name="name"]',function(){$(this).parent().removeClass("has-error")}),$("body").on("keypress",'.sampler-url input[name="url"]',function(){$(this).parent().removeClass("has-error")}),a.createSampler=function(c,d){b.remove(c.arguments,function(a){return""==a.paramName||""==a.paramValue}),0==c.arguments.length&&c.arguments.push({paramName:"",paramValue:""});var e=$(".sampler-form").find(".name-sampler"),f=$(".sampler-form").find(".sampler-url");return a.selected.name||a.selected.url?a.selected.name?a.selected.url?(a.script.samplers.push(c),void(a.selected={method:"GET",constant_time:0,arguments:[{paramName:"",paramValue:""}]})):(f.addClass("has-error"),void f.focus()):(e.addClass("has-error"),void e.focus()):(e.addClass("has-error"),e.focus(),void f.addClass("has-error"))},a.deleteSampler=function(b,c){b.stopPropagation(),a.script.samplers.splice(c,1),a.selected={method:"GET",constant_time:0,arguments:[{paramName:"",paramValue:""}]};var d=$(".btn-uploadFile");d.show()},a.resetSamplerForm=function(){a.selected={method:"GET",constant_time:0,arguments:[{paramName:"",paramValue:""}]};var b=$(".btn-uploadFile");b.show()},a.chooseSampler=function(c,d){b.remove(c.arguments,function(a){return""==a.paramName||""==a.paramValue}),0==c.arguments.length&&c.arguments.push({paramName:"",paramValue:""}),a.selected=c,a.selected.index=d;var e=$(".btn-uploadFile");e.hide()},a.clickUploadScriptButton=function(){$("#createScript .modal-dialog .modal-content").css("width",""),$("#createScript .modal-dialog .modal-content").css("margin-left","20px")},a.clickCreateScriptButton=function(){var b=$("#createScript");b.html(""),a.selected={method:"GET",constant_time:0,arguments:[{paramName:"",paramValue:""}]},a.script={ram_up:5,number_threads:1,duration:0,loops:1,samplers:[]},d("app/performance/views/script-modal-content.tpl.html").then(function(c){b.html(e(c)(a))})},a.editScript=function(b){a.selected={method:"GET",constant_time:0,arguments:[{paramName:"",paramValue:""}]};var c=$("#createScript");d("app/performance/views/script-modal-content.tpl.html").then(function(b){c.html(e(b)(a))}),g.get(a.projectId,b,function(b,c){a.script=b})},a.removeArgument=function(b){a.selected.arguments.splice(b,1)},a.addArgument=function(){var b={paramName:"",paramValue:""};a.selected.arguments.push(b)},a.newSampler=function(){i()},a.basic=function(){h()},a.configuration=function(){h(),j(a.script)};var h=function(){$("#createScript .modal-dialog .modal-content").css("width",""),$("#createScript .modal-dialog .modal-content").css("margin-left",""),$("#createScript .modal-dialog .modal-content .modal-body").css("padding","")},i=function(){$("#createScript .modal-dialog .modal-content").css("width","980px"),$("#createScript .modal-dialog .modal-content").css("margin-left","-120px"),$("#createScript .modal-dialog .modal-content .modal-body").css("padding","0px")},j=function(a){$("#users").bootstrapSlider("setValue",a.number_threads),$("#ramup").bootstrapSlider("setValue",a.ram_up),$("#loops").bootstrapSlider("setValue",a.loops),$("#duration").bootstrapSlider("setValue",a.duration),$("#usersSliderVal").text(a.number_threads),$("#ramupSliderVal").text(a.ram_up),$("#loopsSliderVal").text(a.loops),$("#durationSliderVal").text(a.duration)}}])});