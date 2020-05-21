<template>
  <el-container>
    <el-header>
      <el-row>提示：
        <span v-if="status.blue">
          <span :style="{color: setColor(status.blue.code)}">蓝色</span>:{{ status.blue.message }}、
        </span>
        <span v-if="status.green">
          <span :style="{color: setColor(status.green.code)}">绿色</span>:{{ status.green.message }}、
        </span>
        <span v-if="status.orange">
          <span :style="{color: setColor(status.orange.code)}">橙色</span>:{{ status.orange.message }}、
        </span>
        <span v-if="status.gray">
          <span :style="{color: setColor(status.gray.code)}">灰色</span>:{{ status.gray.message }}、
        </span>
        <span v-if="status.red">
          <span :style="{color: setColor(status.red.code)}">红色</span>:{{ status.red.message }}
        </span>
      </el-row>
    </el-header>
    <el-main>
      <div class="tree-container">
        <el-tree
          ref="tree"
          class="tree"
          :indent="0"
          :data="treeData"
          :show-checkbox="checkbox"
          :props="defaultProps"
          node-key="id"
          highlight-current
          default-expand-all
          :expand-on-click-node="true"
        >
          <span slot-scope="{node, data}" class="custom-tree-node">
            <span :style="{color: setColor(data.status)}">{{ node.label }}</span>
            <el-tag v-if="data.enable" size="mini" type="danger" effect="dark">暂失效</el-tag>
            <span />
          </span>
        </el-tree>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import {getAllService} from '@/api/ms_api'
export default {
  name: 'Tree',
  props: {
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    checkbox: {
      type: Boolean
    },
    status: {
      type: Object,
      default: () => {
        return {
          red: {
            code: -1,
            message: '未通过'
          },
          gray: {
            code: 0,
            message: '待审核'
          },
          orange: {
            code: 1,
            message: '已停用'
          },
          green: {
            code: 2,
            message: '已启用'
          }
        }
      }
    }
  },
  data() {
    return {
      data: [],
      defaultProps: {
        label: 'name'
      }
    }
  },
  computed: {
    treeData1() {
      const data = this.data
      const filterArrTemp = this.treeData
      const treeDataTemp = []
      if (filterArrTemp) {
        const ids = filterArrTemp.map(e => {
          return e['id']
        })
        data.forEach(e => {
          if (e.children) {
            const flag = e.children.some(e1 => {
              return ids.indexOf(e1.id) !== -1
            })
            if (flag) {
              const fath = {
                id: e.id,
                name: e.name,
                children: []
              }
              treeDataTemp.push(fath)
              e.children.forEach(e2 => {
                if (ids.indexOf(e2.id) !== -1) {
                  let status,enable
                  filterArrTemp.forEach(e3 => {
                    if (e3.id === e2.id) {
                      status = e3['status']
                      enable = e3['enable']
                    }
                  })
                  const chil = {
                    id: e2.id,
                    name: e2.name,
                    status: status,
                    enable: enable
                  }
                  fath.children.push(chil)
                }
              })
            }
          } else {
            if (ids.indexOf(e.id) !== -1) {
              let status,enable
              filterArrTemp.forEach(e1 => {
                if (e1.id === e.id) {
                  status = e1['status']
                  enable = e3['enable']
                }
              })
              const fath = {
                id: e.id,
                name: e.name,
                status: status,
                enable: enable
              }
              treeDataTemp.push(fath)
            }
          }
        })
      }
      console.log(this.filterArr)
      console.log(treeDataTemp)
      return treeDataTemp
    }
  },
  watch: {
    filterArr(newVal, oldVal) {
      // if(val === oldVal){
      //     return
      // }
      console.log('oldval', oldVal)
      console.log('newval', newVal)
      console.log('checkdedKeys', this.$refs.tree.getCheckedKeys(true, false))
    }
    // filterArr: {
    //     handler(newVal){
    //         console.log(this.$refs.tree.getCheckedKeys(true, false))
    //     },
    //     immediate: true
    // }
  },
  beforeCreate() {
    console.log('beforeCreate')
  },
  created() {
    getAllService().then(response => {
      this.data = response.data
    })
    console.log('created')
  },
  beforeMount() {
    console.log('beforeMount')
  },
  mounted() {
    const ids = this.treeData.map(e => {
      return e['id']
    })
    this.$refs.tree.setCheckedKeys(ids)
    console.log('mounted')
  },
  beforeUpdate() {
    console.log('beforeUpdate')
  },
  updated() {
    const ids = this.treeData.map(e => {
      return e['id']
    })
    this.$refs.tree.setCheckedKeys(ids)
    console.log('updated')
  },
  beforeDestroy() {
    console.log('beforeDestroy')
  },
  destroyed() {
    console.log('destoryed')
  },
  methods: {
    getIds() {
      return this.$refs.tree.getCheckedKeys(true)
    },
    getOwnerIds() {
      const ids = this.$refs.tree.getCheckedKeys(true, false)
      if (ids) {
        return this.filterArr.filter(item => {
          return ids.indexOf(item.id) !== -1
        }).map(item => {
          return item.ownerId
        })
      }
      return []
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
      } else if (status === -2) {
        return '#F56C6C'
      }
    }
  }
}
</script>
<style>
  .el-header {
    line-height: 60px;
  }
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
</style>
