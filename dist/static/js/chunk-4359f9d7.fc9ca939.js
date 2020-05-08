(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4359f9d7"],{"0e92":function(e,t,a){},2758:function(e,t,a){"use strict";var l=a("0e92"),r=a.n(l);r.a},3211:function(e,t,a){"use strict";var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-form",{staticClass:"demo-table-expand",attrs:{"label-position":"left",inline:""}},[a("el-form-item",{attrs:{label:"接口描述"}},[a("span",[e._v(e._s(e.api.label))])]),e._v(" "),a("el-form-item",{attrs:{label:"接口uri"}},[a("span",[e._v(e._s(e.api.uri))])]),e._v(" "),a("el-form-item",{attrs:{label:"请求方法"}},[a("span",[e._v(e._s(e.api.method))])]),e._v(" "),a("el-form-item",{attrs:{label:"请求参数"}},[a("span",[a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.api.otherInfo.parameters,stripe:"",border:""}},[a("el-table-column",{attrs:{label:"参数名",prop:"name"}}),e._v(" "),a("el-table-column",{attrs:{label:"参数位置",prop:"in"}}),e._v(" "),a("el-table-column",{attrs:{label:"参数描述",prop:"description"}}),e._v(" "),a("el-table-column",{attrs:{label:"是否必须",prop:"required",formatter:e.booleanFormat}}),e._v(" "),a("el-table-column",{attrs:{label:"参数类型",prop:"type"}}),e._v(" "),a("el-table-column",{attrs:{label:"是否可以为空白字符串",prop:"allowEmptyValue",formatter:e.booleanFormat}}),e._v(" "),a("el-table-column",{attrs:{label:"参数样例",prop:"example"}})],1)],1)]),e._v(" "),a("el-form-item",{attrs:{label:"返回结果样例"}},[a("pre",{domProps:{innerHTML:e._s(e.syntaxHighlight(e.api.otherInfo.result))}})]),e._v(" "),a("el-form-item",{attrs:{label:"接收参数方式"}},[a("span",[e._v(e._s(e.api.otherInfo.consumes))])]),e._v(" "),a("el-form-item",{attrs:{label:"返回结果方式"}},[a("span",[e._v(e._s(e.api.otherInfo.produces))])]),e._v(" "),a("el-form-item",{attrs:{label:"响应码"}},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.api.otherInfo.responses,stripe:"",border:""}},[a("el-table-column",{attrs:{label:"响应码",prop:"code"}}),e._v(" "),a("el-table-column",{attrs:{label:"描述",prop:"description"}})],1)],1)],1)},r=[],n=(a("a481"),a("c5f6"),a("fe70")),o={name:"apiInfo",props:{apiId:{type:Number}},data:function(){return{api:{}}},watch:{apiId:function(){this.serviceDetails()}},created:function(){this.serviceDetails()},methods:{serviceDetails:function(){var e=this;Object(n["d"])(this.apiId).then(function(t){e.api=t.data})},booleanFormat:function(e,t,a){var l="";return l=a?"是":"否",l},syntaxHighlight:function(e){return"string"!=typeof e&&(e=JSON.stringify(e,void 0,2)),e=e.replace(/&/g,"&").replace(/</g,"<").replace(/>/g,">"),e.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,function(e){var t="number";return/^"/.test(e)?t=/:$/.test(e)?"key":"string":/true|false/.test(e)?t="boolean":/null/.test(e)&&(t="null"),'<span class="'+t+'">'+e+"</span>"})}}},i=o,s=(a("94de"),a("2877")),c=Object(s["a"])(i,l,r,!1,null,null,null);t["a"]=c.exports},"396e":function(e,t,a){"use strict";a.d(t,"a",function(){return r}),a.d(t,"c",function(){return n}),a.d(t,"d",function(){return o}),a.d(t,"b",function(){return i});var l=a("b775");function r(e){return Object(l["a"])({url:"/apply/create",method:"post",data:e})}function n(){return Object(l["a"])({url:"/apply/all",method:"get"})}function o(e){return Object(l["a"])({url:"/apply/pass/".concat(e),method:"post"})}function i(e){return Object(l["a"])({url:"/apply/deny/".concat(e),method:"post"})}},"3d65":function(e,t,a){"use strict";a.r(t);var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-container",[a("el-header",{attrs:{align:"left"}},[a("el-row",[a("el-col",{attrs:{span:3}},[a("el-button",{attrs:{type:"primary",size:"small",disabled:e.isSelected},on:{click:e.click1}},[e._v("申请接口")])],1),e._v(" "),a("el-col",{attrs:{span:21}},[a("span",{staticStyle:{"font-size":"14px"}},[e._v("提示：\n          "),a("span",{style:{color:e.setColor(0)}},[e._v("蓝色")]),e._v(":待审批、\n          "),a("span",{style:{color:e.setColor(2)}},[e._v("绿色")]),e._v(":已获取(启用状态)、\n          "),a("span",{style:{color:e.setColor(1)}},[e._v("橙色")]),e._v(":已获取(停用状态)\n        ")])])],1)],1),e._v(" "),a("el-container",[a("el-aside",{ref:"left",staticStyle:{width:"400px"}},[a("div",{staticClass:"tree-container"},[a("el-tree",{ref:"tree",staticClass:"tree",attrs:{indent:0,data:e.treeData,"show-checkbox":e.hasPerm(),"default-expand-all":"","node-key":"id","highlight-current":"","expand-on-click-node":!1,props:e.defaultProps},on:{"node-click":e.clickNode,check:e.selectedChange},scopedSlots:e._u([{key:"default",fn:function(t){var l=t.node,r=t.data;return a("span",{staticClass:"custom-tree-node"},[a("span",{style:{color:e.setColor(r.userApiStatus)}},[e._v(e._s(l.label))]),e._v(" "),a("span")])}}])})],1)]),e._v(" "),a("el-main",{ref:"right"},e._l(e.data,function(t,l){return a("el-collapse",{key:l,attrs:{accordion:""},on:{change:e.handleChange},model:{value:e.activeNames,callback:function(t){e.activeNames=t},expression:"activeNames"}},[a("el-collapse-item",{attrs:{title:e.titleFormat([t.label,t.basePath]),name:t.id}},e._l(t.children,function(t,l){return a("el-collapse",{key:l,staticStyle:{"padding-left":"20px"},attrs:{accordion:""},model:{value:e.activeNames1,callback:function(t){e.activeNames1=t},expression:"activeNames1"}},[a("el-collapse-item",{attrs:{title:e.titleFormat([t.label,t.url]),name:t.id}},[a("el-form",{staticClass:"demo-table-expand",attrs:{"label-position":"left",inline:""}},[a("el-form-item",{attrs:{label:"接口描述"}},[a("span",[e._v(e._s(t.label))])]),e._v(" "),a("el-form-item",{attrs:{label:"接口uri"}},[a("span",[e._v(e._s(t.uri))])]),e._v(" "),a("el-form-item",{attrs:{label:"请求方法"}},[a("span",[e._v(e._s(t.method))])]),e._v(" "),a("el-form-item",{attrs:{label:"请求参数"}},[a("span",[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.otherInfo.parameters,stripe:"",border:""}},[a("el-table-column",{attrs:{label:"参数名",prop:"name"}}),e._v(" "),a("el-table-column",{attrs:{label:"参数位置",prop:"in"}}),e._v(" "),a("el-table-column",{attrs:{label:"参数描述",prop:"description"}}),e._v(" "),a("el-table-column",{attrs:{label:"是否必须",prop:"required",formatter:e.booleanFormat}}),e._v(" "),a("el-table-column",{attrs:{label:"参数类型",prop:"type"}}),e._v(" "),a("el-table-column",{attrs:{label:"是否可以为空白字符串",prop:"allowEmptyValue",formatter:e.booleanFormat}}),e._v(" "),a("el-table-column",{attrs:{label:"参数样例",prop:"example"}})],1)],1)]),e._v(" "),a("el-form-item",{attrs:{label:"返回结果样例"}},[a("pre",{domProps:{innerHTML:e._s(e.syntaxHighlight(t.otherInfo.result))}})]),e._v(" "),a("el-form-item",{attrs:{label:"接收参数方式"}},[a("span",[e._v(e._s(t.otherInfo.consumes))])]),e._v(" "),a("el-form-item",{attrs:{label:"返回结果方式"}},[a("span",[e._v(e._s(t.otherInfo.produces))])]),e._v(" "),a("el-form-item",{attrs:{label:"响应码"}},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.otherInfo.responses,stripe:"",border:""}},[a("el-table-column",{attrs:{label:"响应码",prop:"code"}}),e._v(" "),a("el-table-column",{attrs:{label:"描述",prop:"description"}})],1)],1)],1)],1)],1)}),1)],1)}),1)],1),e._v(" "),a("el-dialog",{ref:"dialog",attrs:{visible:e.dialog,"before-close":e.closeDialog,center:!0,width:"550px"},on:{"update:visible":function(t){e.dialog=t}}},[a("info",{ref:"info",attrs:{data:e.treeData,selected:e.selected}}),e._v(" "),a("span",{attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"small"},on:{click:function(t){e.dialog=!1}}},[e._v("取消")]),e._v(" "),a("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.applyApi}},[e._v("申请>")])],1)],1)],1)},r=[],n=(a("a481"),a("ac6a"),a("db72")),o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-form",{ref:"applyForm",attrs:{"label-position":"left",model:e.applyForm,rules:e.applyRules,"label-width":"120px"}},[a("el-form-item",{attrs:{label:"已选择接口",prop:"ids"}},[a("el-col",{attrs:{span:16}},[a("el-cascader",{ref:"cascader",staticStyle:{width:"100%"},attrs:{options:e.data,props:e.props,"show-all-levels":!1},model:{value:e.applyForm.ids,callback:function(t){e.$set(e.applyForm,"ids",t)},expression:"applyForm.ids"}})],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"使用截至日期",prop:"datetime"}},[a("el-col",{attrs:{span:16}},[a("el-date-picker",{staticStyle:{width:"100%"},attrs:{type:"datetime",placeholder:"选择日期","picker-options":e.pickerOptions},model:{value:e.applyForm.datetime,callback:function(t){e.$set(e.applyForm,"datetime",t)},expression:"applyForm.datetime"}})],1)],1)],1)},i=[],s={name:"info",props:{data:{type:Array},selected:{type:Array}},computed:{},methods:{change:function(){console.log(this.selectedIds),console.log(this.$refs.cascader.getCheckedNodes(!0))},getApply:function(){var e;if(this.$refs.applyForm.validate(function(t){if(!t)return console.log("error submit!!"),e=!1,!1;e=!0}),e){var t=this.$refs.cascader.getCheckedNodes(!0);return{ids:t.map(function(e){return e.data.id}),expireTime:this.applyForm.datetime}}}},data:function(){var e=function(e,t,a){console.log(t),t?t<=Date.now()?a(new Error("截至时间不能早于当前时间")):a():a(new Error("请选择使用截至日期"))};return{pickerOptions:{disabledDate:function(e){return e.getTime()<Date.now()},shortcuts:[{text:"一天",onClick:function(e){var t=new Date;t.setTime(t.getTime()+864e5),e.$emit("pick",t)}},{text:"一个月",onClick:function(e){var t=new Date;t.setTime(t.getTime()+2592e6),e.$emit("pick",t)}},{text:"三个月",onClick:function(e){var t=new Date;t.setTime(t.getTime()+7776e6),e.$emit("pick",t)}},{text:"六个月",onClick:function(e){var t=new Date;t.setTime(t.getTime()+15552e6),e.$emit("pick",t)}},{text:"一年",onClick:function(e){var t=new Date;t.setTime(t.getTime()+31104e6),e.$emit("pick",t)}}]},props:{multiple:!0,value:"id"},selectedIds:this.selected,applyForm:{ids:this.selected,datetime:""},applyRules:{ids:[{type:"array",required:!0,message:"请至少选择一个接口",trigger:"change"}],datetime:[{validator:e,required:!0,trigger:"change"}]}}}},c=s,u=a("2877"),p=Object(u["a"])(c,o,i,!1,null,null,null),d=p.exports,f=a("3211"),m=a("fe70"),h=a("396e"),b=a("2f62"),v={components:{info:d,apiInfo:f["a"]},data:function(){return{activeNames:"",activeNames1:"",data:[],defaultProps:{children:"children",label:"label"},dialog:!1,selected:[],isSelected:!0,id:0}},inject:["reload"],computed:Object(n["a"])({treeData:function(){return this.filterProp(this.data)}},Object(b["b"])(["roles"])),methods:{hasPerm:function(){return!this.roles.some(function(e){return-1!==["ADMIN","SUPER_ADMIN"].indexOf(e)})},filterProp:function(e){var t=this;if(e instanceof Array)return e.map(function(e){return t.filterProp(e)});if(e.children){var a=this.filterProp(e.children);return{id:e.id,label:e.label,children:a}}return{id:e.id,label:e.label,userApiStatus:e.userApiStatus,disabled:"undefined"!==typeof e.userApiStatus}},selectedChange:function(){var e=this.$refs.tree.getCheckedKeys(!0);console.log(e),e&&e.length?this.isSelected=!1:this.isSelected=!0},click1:function(){var e=this,t=this.$refs.tree.getCheckedKeys(!0);this.selected=t.map(function(t){var a=e.$refs.tree.getNode(t);return[a.parent.data.id,t]}),this.dialog=!0},applyApi:function(){var e=this,t=this.$refs.info.getApply();if(console.log(t),t){var a=t.ids,l=[];if(!a||!a.length)return void console.log(a);this.findItems(this.treeData,function(e){return-1!==a.indexOf(e.id)},l),Object(h["a"])(t).then(function(t){console.log(t),e.$message({type:"success",message:"操作成功"}),l.forEach(function(e){e.userApiStatus=0,e.disabled=!0}),e.$refs.tree.setCheckedKeys([]),e.dialog=!1}).catch(function(t){450===t.code&&e.reload()})}},findItems:function(e,t,a){var l=this;e.forEach(function(e){e.children?l.findItems(e.children,t,a):t(e)&&a.push(e)})},closeDialog:function(e){e()},clickNode:function(e,t,a){1===t.level?(this.activeNames=e.id,this.activeNames1="",console.log(this.activeNames,this.activeNames1)):2===t.level&&(this.activeNames=t.parent.data.id,this.activeNames1=e.id,console.log(this.activeNames,this.activeNames1))},handleChange:function(e){console.log(e)},handleSelectionChange:function(e){console.log(e)},booleanFormat:function(e,t,a){var l="";return l=a?"是":"否",l},titleFormat:function(e){var t="";return e.forEach(function(e){e&&(t+=e,t+="\t")}),t},syntaxHighlight:function(e){return"string"!=typeof e&&(e=JSON.stringify(e,void 0,2)),e=e.replace(/&/g,"&").replace(/</g,"<").replace(/>/g,">"),e.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,function(e){var t="number";return/^"/.test(e)?t=/:$/.test(e)?"key":"string":/true|false/.test(e)?t="boolean":/null/.test(e)&&(t="null"),'<span class="'+t+'">'+e+"</span>"})},setColor:function(e){return 0===e?"#409EFF":1===e?"#E6A23C":2===e?"#67C23A":-1===e?"#909399":void 0},setId:function(e){var t=this,a=e.children;e instanceof Array?e.forEach(function(e){t.setId(e)}):a instanceof Array?(this.$set(e,"id",this.id++),a.forEach(function(e){t.setId(e)})):this.$set(e,"id",this.id++)}},created:function(){var e=this;Object(m["c"])().then(function(t){e.data=t.data,console.log(e.data)})}},g=v,_=(a("2758"),Object(u["a"])(g,l,r,!1,null,null,null));t["default"]=_.exports},"94de":function(e,t,a){"use strict";var l=a("97fb"),r=a.n(l);r.a},"97fb":function(e,t,a){},fe70:function(e,t,a){"use strict";a.d(t,"i",function(){return r}),a.d(t,"b",function(){return n}),a.d(t,"d",function(){return o}),a.d(t,"c",function(){return i}),a.d(t,"e",function(){return s}),a.d(t,"a",function(){return c}),a.d(t,"g",function(){return u}),a.d(t,"f",function(){return p}),a.d(t,"h",function(){return d});var l=a("b775");function r(e){return Object(l["a"])({url:"/api/update",method:"post",params:{msUrl:e}})}function n(){return Object(l["a"])({url:"/api/all",method:"get"})}function o(e){return Object(l["a"])({url:"/api/".concat(e),method:"get"})}function i(){return Object(l["a"])({url:"/api",method:"get"})}function s(e){return Object(l["a"])({url:"/api/join",method:"post",data:e})}function c(e){return Object(l["a"])({url:"/api/del",method:"post",data:e})}function u(e){return Object(l["a"])({url:"/api/on",method:"post",data:e})}function p(e){return Object(l["a"])({url:"/api/off",method:"post",data:e})}function d(e,t){return Object(l["a"])({url:"/api/sensitive/".concat(e),method:"post",data:t})}}}]);