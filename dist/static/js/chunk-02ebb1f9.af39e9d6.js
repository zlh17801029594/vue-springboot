(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-02ebb1f9"],{"0987":function(t,e,s){"use strict";s.r(e);var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"app-container"},[s("el-table",{staticStyle:{width:"100%"},attrs:{data:t.tableData,"span-method":t.arraySpanMethod,"row-key":"id","row-class-name":t.tableRowClassName,border:""}},[s("el-table-column",{attrs:{type:"index",index:1}}),t._v(" "),s("el-table-column",{attrs:{prop:"label",label:"名称"}}),t._v(" "),s("el-table-column",{attrs:{label:"类型",width:"80"},scopedSlots:t._u([{key:"default",fn:function(e){return[s("el-tag",[t._v(t._s(e.row.children?"用户":"接口"))])]}}])}),t._v(" "),s("el-table-column",{attrs:{label:"接口url"},scopedSlots:t._u([{key:"default",fn:function(e){return[s("el-button",{attrs:{type:"text"},on:{click:function(s){return t.info(e.row)}}},[t._v(t._s(e.row.apiUrl))])]}}])}),t._v(" "),s("el-table-column",{attrs:{prop:"applyTime",label:"申请时间"}}),t._v(" "),s("el-table-column",{attrs:{prop:"expireTime",label:"到期时间"}}),t._v(" "),s("el-table-column",{attrs:{prop:"status",label:"状态",filters:[{text:t.status.on.message,value:t.status.on.code},{text:t.status.off.message,value:t.status.off.code},{text:t.status.expire.message,value:t.status.expire.code}],"filter-method":t.filterStatus,"filter-placement":"bottom-end",width:"280"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.children?s("span",[t._v(t._s(t.show(e.row)))]):s("span",[s("el-tag",{attrs:{type:t.tag_type(e.row),effect:"dark"}},[t._v(t._s(t.show(e.row)))])],1)]}}])}),t._v(" "),s("el-table-column",{attrs:{fixed:"right",label:"操作",width:"300"},scopedSlots:t._u([{key:"default",fn:function(e){return[t.lookShow(e.row)?s("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(s){return t.commonAction(e.row)}}},[t._v(t._s(t.action.look))]):t._e(),t._v(" "),t.commonShow(e.row,-1)?s("el-button",{attrs:{type:"danger",size:"small"},on:{click:function(s){return t.commonAction(e.row,-1)}}},[t._v(t._s(t.action.remove))]):t._e(),t._v(" "),t.commonShow(e.row,1)?s("el-button",{attrs:{type:"success",size:"small"},on:{click:function(s){return t.commonAction(e.row,1)}}},[t._v(t._s(t.action.on))]):t._e(),t._v(" "),t.commonShow(e.row,2)?s("el-button",{attrs:{type:"warning",size:"small"},on:{click:function(s){return t.commonAction(e.row,2)}}},[t._v(t._s(t.action.off))]):t._e(),t._v(" "),t.textShow(e.row)?s("span",[t._v(t._s(t.text(e.row)))]):t._e()]}}])})],1),t._v(" "),s("el-dialog",{ref:"dialog",attrs:{visible:t.dialog,"before-close":t.closeDialog,center:!0},on:{"update:visible":function(e){t.dialog=e}}},[s("tree",{directives:[{name:"show",rawName:"v-show",value:t.showTree,expression:"showTree"}],ref:"tree",attrs:{"filter-arr":t.filterArr,checkbox:t.checkbox,status:t.colorStatus}}),t._v(" "),s("span",{directives:[{name:"show",rawName:"v-show",value:t.showTree,expression:"showTree"}],attrs:{slot:"footer"},slot:"footer"},[s("el-button",{attrs:{size:"small"},on:{click:function(e){t.dialog=!1}}},[t._v("取消")]),t._v(" "),s("el-button",{directives:[{name:"show",rawName:"v-show",value:t.dialogBuSh(-1),expression:"dialogBuSh(-1)"}],attrs:{type:"danger",size:"small"},on:{click:function(e){return t.submit(-1)}}},[t._v(t._s(t.action.remove))]),t._v(" "),s("el-button",{directives:[{name:"show",rawName:"v-show",value:t.dialogBuSh(1),expression:"dialogBuSh(1)"}],attrs:{type:"success",size:"small"},on:{click:function(e){return t.submit(1)}}},[t._v(t._s(t.action.on))]),t._v(" "),s("el-button",{directives:[{name:"show",rawName:"v-show",value:t.dialogBuSh(2),expression:"dialogBuSh(2)"}],attrs:{type:"warning",size:"small"},on:{click:function(e){return t.submit(2)}}},[t._v(t._s(t.action.off))])],1),t._v(" "),s("apiInfo",{directives:[{name:"show",rawName:"v-show",value:t.showInfo,expression:"showInfo"}],attrs:{apiId:t.apiId}})],1)],1)},a=[],o=(s("ac6a"),s("8cf8")),r=s("3211"),i=s("d9e5"),u={components:{tree:o["a"],apiInfo:r["a"]},data:function(){return{tableData:[],filterArr:[],dialog:!1,showTree:!1,showInfo:!1,viewStatus:0,checkbox:!0,status:{disabled:{code:-2,message:"暂失效"},expire:{code:-1,message:"已过期"},off:{code:1,message:"已停用"},on:{code:2,message:"已启用"}},action:{look:"查看",remove:"移除",on:"启用",off:"停用"},apiId:0}},inject:["reload"],computed:{colorStatus:function(){return{red:this.status.disabled,gray:this.status.expire,orange:this.status.off,green:this.status.on}}},created:function(){var t=this;Object(i["b"])().then(function(e){t.tableData=e.data})},mounted:function(){},methods:{textShow:function(t){return!t.children&&2!==t.apiStatus&&-1!==t.status},text:function(t){return 1===t.apiStatus?"接口已停用":0===t.apiStatus?"接口待接入":-1===t.apiStatus?"接口未生效":3===t.apiStatus?"用户敏感级别不足":void 0},commonAction:function(t,e){var s=this,n=[];if(t.children){var a=t.children;"undefined"!==typeof e&&(a=a.filter(function(t){if(2===t.apiStatus||-1===t.status)return t.status===e})),n=a.map(function(t){return 2===t.apiStatus||-1===t.status?{id:t.apiId,ownerId:t.id,status:t.status}:{id:t.apiId,ownerId:t.id,status:s.status.disabled.code}}),this.checkbox="undefined"!==typeof e,this.filterArr=n,this.viewStatus=e,this.dialog=!0,this.showTree=!0,this.showInfo=!1}else if("undefined"!==typeof e){var o=[];this.findItem(this.tableData,function(e){return e.id===t.id},o),e===this.status.on.code?this.$confirm(this.action.off,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",center:"true"}).then(function(e){Object(i["c"])([t.id]).then(function(t){s.$message({type:"success",message:"操作成功"}),o[0].status=s.status.off.code}).catch(function(t){450===t.code&&s.reload()})}).catch(function(t){}):e===this.status.off.code?this.$confirm(this.action.on,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"success",center:"true"}).then(function(e){Object(i["d"])([t.id]).then(function(t){s.$message({type:"success",message:"操作成功"}),o[0].status=s.status.on.code}).catch(function(t){450===t.code&&s.reload()})}).catch(function(t){}):e===this.status.expire.code&&this.$confirm(this.action.remove,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"error",center:"true"}).then(function(e){Object(i["a"])([t.id]).then(function(e){s.$message({type:"success",message:"操作成功"}),s.removeItem(s.tableData,function(e){return e.id===t.id})}).catch(function(t){450===t.code&&s.reload()})}).catch(function(t){})}},submit:function(t){var e=this,s=this.$refs.tree.getOwnerIds(),n=[];s&&s.length?(this.findItem(this.tableData,function(t){return-1!==s.indexOf(t.id)},n),t===this.status.off.code?Object(i["d"])(s).then(function(t){e.$message({type:"success",message:"操作成功"}),n.forEach(function(t){t.status=e.status.on.code})}).catch(function(t){450===t.code&&e.reload()}):t===this.status.on.code?Object(i["c"])(s).then(function(t){e.$message({type:"success",message:"操作成功"}),n.forEach(function(t){t.status=e.status.off.code})}).catch(function(t){450===t.code&&e.reload()}):t===this.status.expire.code&&Object(i["a"])(s).then(function(t){e.$message({type:"success",message:"操作成功"}),s.forEach(function(t){e.removeItem(e.tableData,function(e){return e.id===t})})}).catch(function(t){450===t.code&&e.reload()}),this.dialog=!1):this.$alert("不能为空！")},findItem:function(t,e,s){var n=this;t instanceof Array&&t.forEach(function(t){t.children?n.findItem(t.children,e,s):e(t)&&s.push(t)})},removeItem:function(t,e){var s=this;return t.some(function(n){if(n.children)return s.removeItem(n.children,e);if(e(n)){var a=t.indexOf(n);return t.splice(a,1),!0}})},filterStatus:function(t,e){return e.children?e.children.some(function(e){return e.status===t}):e.status===t},arraySpanMethod:function(t){var e=t.row,s=t.column;t.rowIndex,t.columnIndex;if(e.children){if("接口url"===s.label)return[1,3];if("申请时间"===s.label)return[0,0];if("到期时间"===s.label)return[0,0]}},closeDialog:function(t){t()},dialogBuSh:function(t){return t===this.viewStatus},commonShow:function(t,e){if(t.children){var s=t.children.some(function(t){if(2===t.apiStatus||-1===e)return t.status===e});if(s)return!0}else if(2===t.apiStatus||-1===e)return t.status===e;return!1},lookShow:function(t){return!(!t.children||!t.children.length)},show:function(t){var e=this;if(t.children){var s=t.children,n=0,a=0,o=0,r=0;return s.forEach(function(t){2!==t.apiStatus&&t.status!==e.status.expire.code?r++:t.status===e.status.on.code?n++:t.status===e.status.off.code?a++:t.status===e.status.expire.code&&o++}),this.status.on.message+n+"、"+this.status.off.message+a+"、"+this.status.expire.message+o+"、"+this.status.disabled.message+r}return 2!==t.apiStatus&&t.status!==this.status.expire.code?this.status.disabled.message:t.status===this.status.on.code?this.status.on.message:t.status===this.status.off.code?this.status.off.message:t.status===this.status.expire.code?this.status.expire.message:void 0},tag_type:function(t){return 2!==t.apiStatus&&t.status!==this.status.expire.code?"danger":t.status===this.status.on.code?"success":t.status===this.status.off.code?"warning":t.status===this.status.expire.code?"info":void 0},tableRowClassName:function(t){t.row,t.rowIndex;return""},info:function(t){this.dialog=!0,this.apiId=t.apiId,this.showTree=!1,this.showInfo=!0}}},c=u,l=(s("ad60"),s("2877")),d=Object(l["a"])(c,n,a,!1,null,null,null);e["default"]=d.exports},3211:function(t,e,s){"use strict";var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("el-form",{staticClass:"demo-table-expand",attrs:{"label-position":"left",inline:""}},[s("el-form-item",{attrs:{label:"接口描述"}},[s("span",[t._v(t._s(t.api.label))])]),t._v(" "),s("el-form-item",{attrs:{label:"接口uri"}},[s("span",[t._v(t._s(t.api.uri))])]),t._v(" "),s("el-form-item",{attrs:{label:"请求方法"}},[s("span",[t._v(t._s(t.api.method))])]),t._v(" "),s("el-form-item",{attrs:{label:"请求参数"}},[s("span",[s("el-table",{staticStyle:{width:"100%"},attrs:{data:t.api.otherInfo.parameters,stripe:"",border:""}},[s("el-table-column",{attrs:{label:"参数名",prop:"name"}}),t._v(" "),s("el-table-column",{attrs:{label:"参数位置",prop:"in"}}),t._v(" "),s("el-table-column",{attrs:{label:"参数描述",prop:"description"}}),t._v(" "),s("el-table-column",{attrs:{label:"是否必须",prop:"required",formatter:t.booleanFormat}}),t._v(" "),s("el-table-column",{attrs:{label:"参数类型",prop:"type"}}),t._v(" "),s("el-table-column",{attrs:{label:"是否可以为空白字符串",prop:"allowEmptyValue",formatter:t.booleanFormat}}),t._v(" "),s("el-table-column",{attrs:{label:"参数样例",prop:"example"}})],1)],1)]),t._v(" "),s("el-form-item",{attrs:{label:"返回结果样例"}},[s("pre",{domProps:{innerHTML:t._s(t.syntaxHighlight(t.api.otherInfo.result))}})]),t._v(" "),s("el-form-item",{attrs:{label:"接收参数方式"}},[s("span",[t._v(t._s(t.api.otherInfo.consumes))])]),t._v(" "),s("el-form-item",{attrs:{label:"返回结果方式"}},[s("span",[t._v(t._s(t.api.otherInfo.produces))])]),t._v(" "),s("el-form-item",{attrs:{label:"响应码"}},[s("el-table",{staticStyle:{width:"100%"},attrs:{data:t.api.otherInfo.responses,stripe:"",border:""}},[s("el-table-column",{attrs:{label:"响应码",prop:"code"}}),t._v(" "),s("el-table-column",{attrs:{label:"描述",prop:"description"}})],1)],1)],1)},a=[],o=(s("a481"),s("c5f6"),s("fe70")),r={name:"apiInfo",props:{apiId:{type:Number}},data:function(){return{api:{}}},watch:{apiId:function(){this.serviceDetails()}},created:function(){this.serviceDetails()},methods:{serviceDetails:function(){var t=this;Object(o["d"])(this.apiId).then(function(e){t.api=e.data})},booleanFormat:function(t,e,s){var n="";return n=s?"是":"否",n},syntaxHighlight:function(t){return"string"!=typeof t&&(t=JSON.stringify(t,void 0,2)),t=t.replace(/&/g,"&").replace(/</g,"<").replace(/>/g,">"),t.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,function(t){var e="number";return/^"/.test(t)?e=/:$/.test(t)?"key":"string":/true|false/.test(t)?e="boolean":/null/.test(t)&&(e="null"),'<span class="'+e+'">'+t+"</span>"})}}},i=r,u=(s("94de"),s("2877")),c=Object(u["a"])(i,n,a,!1,null,null,null);e["a"]=c.exports},8747:function(t,e,s){},"8cf8":function(t,e,s){"use strict";var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("el-container",[s("el-header",[s("p",[t._v("提示：\n      "),t.status.blue?s("span",[s("span",{style:{color:t.setColor(t.status.blue.code)}},[t._v("蓝色")]),t._v(":"+t._s(t.status.blue.message)+"、\n      ")]):t._e(),t._v(" "),t.status.green?s("span",[s("span",{style:{color:t.setColor(t.status.green.code)}},[t._v("绿色")]),t._v(":"+t._s(t.status.green.message)+"、\n      ")]):t._e(),t._v(" "),t.status.orange?s("span",[s("span",{style:{color:t.setColor(t.status.orange.code)}},[t._v("橙色")]),t._v(":"+t._s(t.status.orange.message)+"、\n      ")]):t._e(),t._v(" "),t.status.gray?s("span",[s("span",{style:{color:t.setColor(t.status.gray.code)}},[t._v("灰色")]),t._v(":"+t._s(t.status.gray.message)+"、\n      ")]):t._e(),t._v(" "),t.status.red?s("span",[s("span",{style:{color:t.setColor(t.status.red.code)}},[t._v("红色")]),t._v(":"+t._s(t.status.red.message)+"\n      ")]):t._e()])]),t._v(" "),s("el-main",[s("div",{staticClass:"tree-container"},[s("el-tree",{ref:"tree",staticClass:"tree",attrs:{indent:0,data:t.treeData,"show-checkbox":t.checkbox,"node-key":"id","highlight-current":"","default-expand-all":"","expand-on-click-node":!0},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.node,a=e.data;return s("span",{staticClass:"custom-tree-node"},[s("span",{style:{color:t.setColor(a.status)}},[t._v(t._s(n.label))]),t._v(" "),s("span")])}}])})],1)])],1)},a=[],o=(s("ac6a"),s("fe70")),r={name:"Tree",props:{filterArr:{type:Array,default:function(){return[]}},checkbox:{type:Boolean},status:{type:Object,default:function(){return{red:{code:-1,message:"未通过"},gray:{code:0,message:"待审核"},orange:{code:1,message:"已停用"},green:{code:2,message:"已启用"}}}}},data:function(){return{data:[]}},computed:{treeData:function(){var t=this.data,e=this.filterArr,s=[];if(e){var n=e.map(function(t){return t["id"]});t.forEach(function(t){if(t.children){var a=t.children.some(function(t){return-1!==n.indexOf(t.id)});if(a){var o={id:t.id,label:t.label,children:[]};s.push(o),t.children.forEach(function(t){if(-1!==n.indexOf(t.id)){var s;e.forEach(function(e){e.id===t.id&&(s=e["status"])});var a={id:t.id,label:t.label,status:s};o.children.push(a)}})}}else if(-1!==n.indexOf(t.id)){var r;e.forEach(function(e){e.id===t.id&&(r=e["status"])});var i={id:t.id,label:t.label,status:r};s.push(i)}})}return console.log(this.filterArr),console.log(s),s}},watch:{filterArr:function(t,e){console.log("oldval",e),console.log("newval",t),console.log("checkdedKeys",this.$refs.tree.getCheckedKeys(!0,!1))}},beforeCreate:function(){console.log("beforeCreate")},created:function(){var t=this;Object(o["b"])().then(function(e){t.data=e.data}),console.log("created")},beforeMount:function(){console.log("beforeMount")},mounted:function(){var t=this.filterArr.map(function(t){return t["id"]});this.$refs.tree.setCheckedKeys(t),console.log("mounted")},beforeUpdate:function(){console.log("beforeUpdate")},updated:function(){var t=this.filterArr.map(function(t){return t["id"]});this.$refs.tree.setCheckedKeys(t),console.log("updated")},beforeDestroy:function(){console.log("beforeDestroy")},destroyed:function(){console.log("destoryed")},methods:{getIds:function(){return this.$refs.tree.getCheckedKeys(!0,!1)},getOwnerIds:function(){var t=this.$refs.tree.getCheckedKeys(!0,!1);return t?this.filterArr.filter(function(e){return-1!==t.indexOf(e.id)}).map(function(t){return t.ownerId}):[]},setColor:function(t){return 0===t?"#409EFF":1===t?"#E6A23C":2===t?"#67C23A":-1===t?"#909399":-2===t?"#F56C6C":void 0}}},i=r,u=(s("d0b9"),s("2877")),c=Object(u["a"])(i,n,a,!1,null,null,null);e["a"]=c.exports},"94de":function(t,e,s){"use strict";var n=s("97fb"),a=s.n(n);a.a},"97fb":function(t,e,s){},ad60:function(t,e,s){"use strict";var n=s("ae6e"),a=s.n(n);a.a},ae6e:function(t,e,s){},d0b9:function(t,e,s){"use strict";var n=s("8747"),a=s.n(n);a.a},d9e5:function(t,e,s){"use strict";s.d(e,"b",function(){return a}),s.d(e,"d",function(){return o}),s.d(e,"c",function(){return r}),s.d(e,"a",function(){return i});var n=s("b775");function a(){return Object(n["a"])({url:"/user/all",method:"get"})}function o(t){return Object(n["a"])({url:"/user_api/on",method:"post",data:t})}function r(t){return Object(n["a"])({url:"/user_api/off",method:"post",data:t})}function i(t){return Object(n["a"])({url:"/user_api/del",method:"post",data:t})}},fe70:function(t,e,s){"use strict";s.d(e,"i",function(){return a}),s.d(e,"b",function(){return o}),s.d(e,"d",function(){return r}),s.d(e,"c",function(){return i}),s.d(e,"e",function(){return u}),s.d(e,"a",function(){return c}),s.d(e,"g",function(){return l}),s.d(e,"f",function(){return d}),s.d(e,"h",function(){return f});var n=s("b775");function a(t){return Object(n["a"])({url:"/api/update",method:"post",params:{msUrl:t}})}function o(){return Object(n["a"])({url:"/api/all",method:"get"})}function r(t){return Object(n["a"])({url:"/api/".concat(t),method:"get"})}function i(){return Object(n["a"])({url:"/api",method:"get"})}function u(t){return Object(n["a"])({url:"/api/join",method:"post",data:t})}function c(t){return Object(n["a"])({url:"/api/del",method:"post",data:t})}function l(t){return Object(n["a"])({url:"/api/on",method:"post",data:t})}function d(t){return Object(n["a"])({url:"/api/off",method:"post",data:t})}function f(t,e){return Object(n["a"])({url:"/api/sensitive/".concat(t),method:"post",data:e})}}}]);