<template>
  <el-container>
    <el-header align="left">
      <el-row>
        <el-col :span="2"><el-button type="primary" size="small" @click="click1" :disabled="isSelected">申请接口</el-button></el-col>
        <el-col :span="22">
          <span style="font-size: 14px;">提示：
            <span :style="{color: setColor(0)}">蓝色</span>:待审批、
            <span :style="{color: setColor(2)}">绿色</span>:已启用、
            <span :style="{color: setColor(1)}">橙色</span>:已停用
          </span>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
        <el-aside ref="left" style="width: 500px">
          <el-card shadow="never">
            <div class="tree-container">
              <el-tree
              class="tree"
              :indent="0"
              ref="tree"
              v-loading="loading"
              element-loading-text="加载中..."
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
          </el-card>
          
        </el-aside>
        <el-main ref="right">
            <apiInfo v-if="api" :api="api" />
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

import {getServiceByUser, getServiceDetailsById} from '@/api/ms_api'
import {createApply} from '@/api/ms_apply'
import { mapGetters } from 'vuex'

export default {
    components: {
        info, apiInfo
    },
    data() {
      return {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          disabled: this.disable
        },
        dialog: false,
        selected: [],
        isSelected: true,
        id: 0,
        api: undefined,
        loading: true
      }
    },
    inject: ['reload'],
    computed: {
      treeData(){
        return this.data
      },
      ...mapGetters([
      'roles'
      ])
    },
    methods: {
      disable(data, node){
        return typeof data.userApiStatus !== 'undefined'
      },
      hasPerm(){
      return !this.roles.some(item => {
          return ['ADMIN', 'SUPER_ADMIN'].indexOf(item) !== -1
        })
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
                // e.userApiStatus = 0
                this.$set(e, 'userApiStatus', 0)
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
      async clickNode (data, node, obj) {	
        if(data.type && !data.apiDetails){
          await getServiceDetailsById(data.id).then(response => {
            this.$set(data, 'apiDetails', response.data)
          })
        }
        this.api = data
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
      async getList(){
        getServiceByUser().then(response => {
        this.data = response.data
        if(this.data && this.data.length){
          this.api = this.data[0]
        }
        console.log(this.data)
      })
      }
    },
    created() {
      
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