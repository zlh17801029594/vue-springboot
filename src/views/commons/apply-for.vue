<template>
  <el-container>
    <el-header align="left">
      <span>
        <el-button type="primary" size="small" @click="click1">申请接口</el-button>
        <span style="font-size: 14px;">提示：
          <span :style="{color: setColor(-1)}">蓝色</span>:待审批、
          <span :style="{color: setColor(2)}">绿色</span>:已获取(启用状态)、
          <span :style="{color: setColor(1)}">橙色</span>:已获取(停用状态)
        </span>
      </span>
    </el-header>
    <el-container>
        <el-aside ref="left">
            <el-tree
            ref="tree"
            :data="treeData"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            @node-click="clickNode"
            :props="defaultProps">
            <span class="custom-tree-node" slot-scope="{node, data}">
                <span>{{ node.label }}</span>
                <span>
                
                </span>
            </span>
            </el-tree>
        </el-aside>
        <el-main ref="right">
          <el-scrollbar style="height:100%">
            <el-collapse v-for="(service, index) in data" :key="index" v-model="activeNames" @change="handleChange" accordion>
                <el-collapse-item :title="titleFormat([service.label, service.basePath])" :name="service.id">
                  <el-collapse v-for="(api, index) in service.children" :key="index" v-model="activeNames1" accordion style="padding-left: 20px">
                    <el-collapse-item :title="titleFormat([api.label, api.url])" :name="api.id">
                      <apiInfo :api="api" />
                    </el-collapse-item>
                  </el-collapse>
                </el-collapse-item>
            </el-collapse>
          </el-scrollbar>
        </el-main>
    </el-container>
    <el-dialog
        :visible.sync="dialog"
        :before-close="closeDialog"
        ref="dialog"
        :center="true"
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
import BScroll from 'better-scroll'
import info from './apply-for-info'
import apiInfo from './api-info-view'

import {getService} from '@/api/ms_api'
import {createApply} from '@/api/ms_apply'

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
        id: 0
      }
    },
    computed: {
      treeData(){
        return this.filterProp(this.data)
      }
    },
    methods: {
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
              status: data.id === 1 ? -1 : 0,
              // 真实数据改成status判断
              disabled: data.id === 1
            }
          }
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
        createApply(msUserApis).then(response => {
          console.log(response)
          this.$message({
              type: 'success',
              message: '操作成功'
            })
        })
        this.dialog = false
      },
      closeDialog(done){
        done()
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
      _initScroll(){
          this.left = new BScroll((this.$refs.left), {
              click: true
          })
          this.right = new BScroll((this.$refs.right), {
              click: true
          })
      },
      setColor(status) {
        if (status === 0) {
          return '#909399'
        } else if (status === 1) {
          return '#E6A23C'
        } else if (status === 2) {
          return '#67C23A'
        } else if (status === -1) {
          return '#409EFF'
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
  /* .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  } */
  
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
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>