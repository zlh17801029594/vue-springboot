<template>
  <el-container>
    <el-header align="left">
      <el-row>
        <el-col :span="2"><el-button type="primary" size="small" :disabled="isSelected" @click="click1">申请接口</el-button></el-col>
        <el-col :span="22">
          <span style="font-size: 14px;">提示：
            <span :style="{color: setColor(0)}">蓝色</span>:待审批、
            <span :style="{color: setColor(2)}">绿色</span>:已启用、
            <span :style="{color: setColor(1)}">橙色</span>:已停用
          </span>
        </el-col>
      </el-row>
    </el-header>
    <el-container
      v-loading="loading"
      style="height: calc(100vh - 164px); margin: 0 20px"
      element-loading-text="加载中..."
    >
      <el-aside ref="left" style="width: 30%; margin: 0; padding: 4px">
        <el-card style="min-height: 100%">
          <div class="tree-container">
            <el-tree
              ref="tree"
              class="tree"
              :indent="0"
              empty-text="无可申请接口"
              :data="treeData"
              :show-checkbox="hasPerm()"
              default-expand-all
              node-key="id"
              highlight-current
              :expand-on-click-node="false"
              :props="defaultProps"
              @node-click="clickNode"
              @check="selectedChange"
            >
              <span slot-scope="{node, data}" class="custom-tree-node">
                <span :style="{color: setColor(data.userApiStatus)}">{{ node.label }}</span>
                <span />
              </span>
            </el-tree>
          </div>
        </el-card>
      </el-aside>
      <el-main ref="right" style="padding: 4px">
        <el-card style="min-height: 100%">
          <apiInfo v-if="api" :api="api" />
        </el-card>
      </el-main>
    </el-container>
    <el-dialog
      ref="dialog"
      :visible.sync="dialog"
      :center="true"
      title="接口申请"
      width="550px"
    >
      <info ref="info" :data="treeDataNode" :selected="selected" />
      <span slot="footer">
        <el-button size="small" @click="dialog=false">取消</el-button>
        <el-button type="primary" size="small" @click="applyApi">申请></el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import info from './apply-for-info'
import apiInfo from '../api-info-view'

import { getServiceByUser, getServiceDetailsById } from '@/api/ms_api'
import { createApply } from '@/api/ms_apply'
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
        label: 'name'
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
    treeData() {
      this.reverseDisabled(this.data)
      return this.data
    },
    treeDataNode() {
      if (this.treeData && this.treeData.length) {
        return this.treeData[0].children
      }
    },
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    reverseDisabled(arr) {
      arr.forEach(item => {
        if (item.children) {
          this.reverseDisabled(item.children)
        } else {
          if (typeof item.userApiStatus !== 'undefined') {
            this.$set(item, 'disabled', true)
          }
        }
      })
    },
    disable(data, node) {
      return typeof data.userApiStatus !== 'undefined'
    },
    hasPerm() {
      return !this.roles.some(item => {
        return ['ADMIN', 'SUPER_ADMIN'].indexOf(item) !== -1
      })
    },
    selectedChange() {
      const selectNodeIds = this.$refs.tree.getCheckedKeys(true)
      console.log(selectNodeIds)
      if (selectNodeIds && selectNodeIds.length) {
        this.isSelected = false
      } else {
        this.isSelected = true
      }
    },
    click1() {
      const selectNodeIds = this.$refs.tree.getCheckedKeys(true)
      this.selected = selectNodeIds.map(nodeId => {
        const node = this.$refs.tree.getNode(nodeId)
        return [node.parent.data.id, nodeId]
      })
      this.dialog = true
    },
    applyApi() {
      const msUserApis = this.$refs.info.getApply()
      console.log(msUserApis)
      if (msUserApis) {
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
              if (res.code === 450) {
                this.getList()
                this.dialog = false
              }
            })
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
    async clickNode(data, node, obj) {
      if (data.id !== -1) {
        if (data.type && !data.apiDetails) {
          await getServiceDetailsById(data.id).then(response => {
            this.$set(data, 'apiDetails', response.data)
          })
        }
        this.api = data
      } else {
        this.api = null
      }
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
    async getList() {
      this.loading = true
      await getServiceByUser().then(response => {
        const data = response.data
        if (data && data.length) {
          this.api = data[0]
          this.data = [{
            id: -1,
            name: '根节点',
            children: data
          }]
        }
        console.log(this.data)
      }).catch(_ => {

      })
      this.loading = false
    }
  }
}
</script>
<style>
  .tree /deep/ .el-tree-node {
    position: relative;
    /* padding-left: 16px; */
  }
  .tree /deep/ .el-tree-node__children {
    padding-left: 32px;
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
    left: -20px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree /deep/ .el-tree-node:after {
    content: "";
    left: -20px;
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
  /* .el-main {
    padding: 0 20px;
  } */
  .el-aside{
      padding: 0;
      background: #FFF
  }
  /* .el-header{
      padding-top: 10px
  } */
</style>
