<template>
  <el-container>
    <el-header align="left">
      <el-row>
        <el-col :span="3"><el-button type="primary" size="small" @click="click1" :disabled="isSelected">申请接口</el-button></el-col>
        <el-col :span="21">
          <span style="font-size: 14px;">提示：
            <span :style="{color: setColor(0)}">蓝色</span>:待审批、
            <span :style="{color: setColor(2)}">绿色</span>:已获取(启用状态)、
            <span :style="{color: setColor(1)}">橙色</span>:已获取(停用状态)
          </span>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
        <el-aside ref="left" style="width: 400px">
          <div class="tree-container">
            <el-tree
            class="tree"
            :indent="0"
            ref="tree"
            :data="treeData"
            :show-checkbox="hasPerm()"
            default-expand-all
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            @node-click="clickNode"
            @check="selectedChange"
            :props="defaultProps">
            <span class="custom-tree-node" slot-scope="{node, data}">
                <span :style="{color: setColor(data.userApiStatus)}">{{ node.label }}</span>
                <span>
                
                </span>
            </span>
            </el-tree>
          </div>
        </el-aside>
        <el-main ref="right">
            <el-collapse v-for="(service, index) in data" :key="index" v-model="activeNames" @change="handleChange" accordion>
                <el-collapse-item :title="titleFormat([service.label, service.basePath])" :name="service.id">
                  <el-collapse v-for="(api, index) in service.children" :key="index" v-model="activeNames1" accordion style="padding-left: 20px">
                    <el-collapse-item :title="titleFormat([api.label, api.url])" :name="api.id">
                      <!-- <apiInfo :api="api" /> -->
                      <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="接口描述">
                          <span>{{ api.label }}</span>
                        </el-form-item>
                        <el-form-item label="接口uri">
                          <span>{{ api.uri }}</span>
                        </el-form-item>
                        <el-form-item label="请求方法">
                          <span>{{ api.method }}</span>
                        </el-form-item>
                        <el-form-item label="请求参数">
                          <span>
                            <el-table :data="api.otherInfo.parameters" stripe border style="width: 100%;">
                              <el-table-column label="参数名" prop="name"></el-table-column>
                              <el-table-column label="参数位置" prop="in"></el-table-column>
                              <el-table-column label="参数描述" prop="description"></el-table-column>
                              <el-table-column label="是否必须" prop="required" :formatter="booleanFormat"></el-table-column>
                              <el-table-column label="参数类型" prop="type"></el-table-column>
                              <el-table-column label="是否可以为空白字符串" prop="allowEmptyValue" :formatter="booleanFormat"></el-table-column>
                              <el-table-column label="参数样例" prop="example"></el-table-column>
                            </el-table>
                          </span>
                        </el-form-item>
                        <el-form-item label="返回结果样例">
                          <pre v-html="syntaxHighlight(api.otherInfo.result)"></pre>
                          <!--<pre>{{ api.result}}</pre>-->
                          <!--<span>{{ api.result}}</span>-->
                          <!--:span布局-->
                          <!--<span>
                              <div  v-for="person in test" style="width: 100%;">
                              <el-row>
                                  <el-col :span="8">{{person.name}}</el-col>
                                  <el-col :span="8">{{person.age}}</el-col>
                              </el-row>
                              </div>
                          </span>-->
                        </el-form-item>
                        <el-form-item label="接收参数方式">
                          <span>{{ api.otherInfo.consumes }}</span>
                        </el-form-item>
                        <el-form-item label="返回结果方式">
                          <span>{{ api.otherInfo.produces }}</span>
                        </el-form-item>
                        <el-form-item label="响应码">
                          <el-table :data="api.otherInfo.responses" stripe border style="width: 100%;">
                            <el-table-column label="响应码" prop="code"></el-table-column>
                            <el-table-column label="描述" prop="description"></el-table-column>
                          </el-table>
                        </el-form-item>
                      </el-form>
                    </el-collapse-item>
                  </el-collapse>
                </el-collapse-item>
            </el-collapse>
        </el-main>
    </el-container>
    <el-dialog
        :visible.sync="dialog"
        ref="dialog"
        :center="true"
        title="接口申请"
        width="550px">
        <info ref="info" :data='treeData' :selected='selected' />
        <span slot="footer">
          <el-button size="small" @click="dialog=false">取消</el-button>
          <el-button type="primary" size="small" @click="applyApi">申请></el-button>
        </span>
    </el-dialog>
  </el-container>
</template>

<script>
import info from './apply-for-info'
import apiInfo from './api-info-view'

import {getService} from '@/api/ms_api'
import {createApply} from '@/api/ms_apply'
import { mapGetters } from 'vuex'

export default {
    components: {
        info, apiInfo
    },
    data() {
      return {
        activeNames: '',
        activeNames1: '',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dialog: false,
        selected: [],
        isSelected: true,
        id: 0
      }
    },
    inject: ['reload'],
    computed: {
      treeData(){
        return this.filterProp(this.data)
      },
      ...mapGetters([
      'roles'
      ])
    },
    methods: {
      hasPerm(){
      return !this.roles.some(item => {
          return ['ADMIN', 'SUPER_ADMIN'].indexOf(item) !== -1
        })
      },
      filterProp(data){
        if(data instanceof Array){
          return data.map(item => {
            return this.filterProp(item)
          })
        }else{
          if(data.children){
            const children = this.filterProp(data.children)
            return {
              id: data.id,
              label: data.label,
              children: children
            }
          }else{
            return {
              id: data.id,
              label: data.label,
              // 真实环境通过用户关系表查询
              userApiStatus: data.userApiStatus,
              // 真实数据改成status判断
              disabled: typeof data.userApiStatus !== 'undefined' 
            }
          }
        }
      },
      selectedChange(){
        const selectNodeIds = this.$refs.tree.getCheckedKeys(true)
        console.log(selectNodeIds)
        if(selectNodeIds && selectNodeIds.length){
          this.isSelected = false
        }else{
          this.isSelected = true
        }
      },
      click1(){
        const selectNodeIds = this.$refs.tree.getCheckedKeys(true)
        this.selected = selectNodeIds.map(nodeId => {
          const node = this.$refs.tree.getNode(nodeId)
          return [node.parent.data.id, nodeId]
        })
        this.dialog = true
      },
      applyApi(){
        const msUserApis = this.$refs.info.getApply()
        console.log(msUserApis)
        if(msUserApis){
          const ids = msUserApis.ids
          const dataNodes = []
          if (ids && ids.length) {
            this.findItems(
              this.treeData,
              item => {
                return ids.indexOf(item.id) !== -1
              },
              dataNodes
            )
            createApply(msUserApis).then(response => {
              console.log(response)
              this.$message({
                  type: 'success',
                  message: '操作成功'
                })
              dataNodes.forEach(e => {
                e.userApiStatus = 0
                e.disabled = true
              })
              this.$refs.tree.setCheckedKeys([])
              this.dialog = false
            })
            .catch(res => {
                      if(res.code === 450)
                        this.reload()
                    })
          } else {
            console.log(ids)
            // this.$alert('不能为空！')
            return
          }
        }
      },
      findItems(arr, fn, dataNodes) {
        arr.forEach(item => {
          if (item.children) {
            this.findItems(item.children, fn, dataNodes)
          } else {
            if (fn(item)) {
              dataNodes.push(item)
            }
          }
        })
      },
      clickNode (data, node, obj) {	
        if (node.level === 1) {
            this.activeNames = data.id
            this.activeNames1 = ''
            console.log(this.activeNames, this.activeNames1)
        } else if (node.level === 2) {
            this.activeNames = node.parent.data.id
            this.activeNames1 = data.id
            console.log(this.activeNames, this.activeNames1)
        }
      },
      handleChange(val) {
        console.log(val)
      },
      handleSelectionChange(val) {
        console.log(val)
      },
      booleanFormat(row, col, cellValue){
        let value = ''
        if (cellValue) {
          value = '是';
        } else {
          value = '否'
        }
        return value
      },
      titleFormat(list) {
        let title = ''
        list.forEach(value => {
          if (value){
            title += value
            title += "\t"
          }
        })
        return title
      },
      syntaxHighlight(json) {
        if (typeof json != 'string') {
          json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
          let cls = 'number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
            } else {
              cls = 'string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
        });
      },
      setColor(status) {
        if (status === 0) {
          return '#409EFF'
        } else if (status === 1) {
          return '#E6A23C'
        } else if (status === 2) {
          return '#67C23A'
        } else if (status === -1) {
          return '#909399'
        }
      },
      setId(data){
        const arr = data.children
        if(data instanceof Array){
          data.forEach(item => {
            this.setId(item)
          })
        }else if(arr instanceof Array){
          this.$set(data, 'id', this.id++)
          arr.forEach(item => {
            this.setId(item)
          })
        }else{
          this.$set(data, 'id', this.id++)
        }
      }
    },
    created() {
      getService().then(response => {
        this.data = response.data
        console.log(this.data)
      })
    }
}
</script>
<style>
  .tree /deep/ .el-tree-node {
    position: relative;
    padding-left: 16px;
  }
  .tree /deep/ .el-tree-node__children {
    padding-left: 16px;
  }
  .tree /deep/ .el-tree-node :last-child:before {
    height: 38px;
  }
  .tree /deep/ .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .tree-container /deep/ .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .tree-container /deep/ .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .tree /deep/ .el-tree-node:before {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree /deep/ .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree /deep/ .el-tree-node:before {
    border-left: 1px dashed #4386c6;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 20px;
  }
  .tree /deep/ .el-tree-node:after {
    border-top: 1px dashed #4386c6;
    height: 20px;
    top: 12px;
    width: 24px;
  }
  
  /*pre {outline: 1px solid #ccc; }*/
  .string { color: green; }
  .number { color: darkorange; }
  .boolean { color: blue; }
  .null { color: magenta; }
  .key { color: red; }

  .el-header {
    line-height: 60px;
  }
  .el-main {
    padding: 0 20px;
  }
  .el-aside{
      padding: 0 20px;
      background: #FFF
  }
  /* .el-header{
      padding-top: 10px
  } */
</style>