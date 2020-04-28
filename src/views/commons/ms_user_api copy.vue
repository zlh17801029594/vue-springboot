<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      :span-method="arraySpanMethod"
      row-key="id"
      :row-class-name="tableRowClassName"
      border
      style="width: 100%"
    >
      <el-table-column fixed prop="id" label="ID" width="180"/>
      <el-table-column prop="username" label="用户/接口名" />
      <el-table-column label="接口url">
        <template slot-scope="scope">
          <el-button type="text" @click="info(scope.row)">{{ scope.row.apiUrl }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" />
      <el-table-column prop="expiringTime" label="到期时间" />
      <el-table-column
        prop="status"
        label="状态"
        :formatter="show"
        :filters="[{ text: status.approve.message, value: status.approve.code }
                   , { text: status.on.message, value: status.on.code }
                   , { text: status.off.message, value: status.off.code }
                   , { text: status.deny.message, value: status.deny.code }]"
        :filter-method="filterStatus"
        filter-placement="bottom-end"
        width="280"
      />
      <el-table-column fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            v-if="lookShow(scope.row)"
            type="primary"
            size="small"
            @click="commonAction(scope.row)"
          >{{ action.look }}</el-button>
          <el-button
            v-if="commonShow(scope.row, 0)"
            type="primary"
            size="small"
            @click="commonAction(scope.row, 0)"
          >{{ action.approve }}</el-button>
          <el-button
            v-if="commonShow(scope.row, 1)"
            type="success"
            size="small"
            @click="commonAction(scope.row, 1)"
          >{{ action.on }}</el-button>
          <el-button
            v-if="commonShow(scope.row, 2)"
            type="warning"
            size="small"
            @click="commonAction(scope.row, 2)"
          >{{ action.off }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog ref="dialog" :visible.sync="dialog" :before-close="closeDialog" :center="true">
      <tree v-show="showTree" ref="tree" :filter-arr="filterArr" :checkbox="checkbox" :status="colorStatus" :data="tableData" />
      <span v-show="showTree" slot="footer">
        <el-button size="small" @click="dialog=false">取消</el-button>
        <el-button v-show="dialogBuSh(1)" type="success" size="small" @click="submit(1)">{{ action.on }}</el-button>
        <el-button v-show="dialogBuSh(2)" type="warning" size="small" @click="submit(2)">{{ action.off }}</el-button>
      </span>
      <apiInfo v-show="showInfo" />
    </el-dialog>
  </div>
</template>
<script>
import tree from './micro-service-tree'
import apiInfo from './api-info-view'
import {getUserApi} from '@/api/ms_user_api'
import {getAllService, updateService} from '@/api/ms_api'
export default {
  components: {
    tree,
    apiInfo
  },
  data() {
    return {
      tableData: [],
      filterArr: [],
      dialog: false,
      showTree: false,
      showInfo: false,
      viewStatus: 0,
      checkbox: true,
      status: {
        deny: {
          code: -1,
          message: '未通过'
        },
        approve: {
          code: 0,
          message: '待审批'
        },
        off: {
          code: 1,
          message: '已停用'
        },
        on: {
          code: 2,
          message: '已启用'
        }
      },
      action: {
        look: '查看',
        approve: '审批',
        on: '启用',
        off: '停用',
        pass: '通过',
        deny: '拒绝'
      }
    }
  },
  computed: {
    colorStatus() {
      return {
        red: this.status.deny,
        gray: this.status.approve,
        orange: this.status.off,
        green: this.status.on
      }
    }
  },
  created() {
    getUserApi().then(response => {
      this.tableData = response.data
    })
  },
  mounted() {
  },
  methods: {
    commonAction(row, status) {
      let idStatus = []
      if (row.children) {
        let childrenArr = row.children
        if (typeof status !== 'undefined') {
          childrenArr = childrenArr.filter(e => {
            return e.status === status
          })
        }
        idStatus = childrenArr.map(e => {
          return { id: e.apiRef, ownerId: e.id, status: e.status }
        })
      } else {
        // 单条数据不展示树结构
        if (typeof status !== 'undefined') {
          const dataNode = []
          this.findItem(
            this.tableData,
            item => {
              return item.id === row.id
            },
            dataNode
          )
          if (status === this.status.approve.code) {
            this.$confirm(this.action.approve, '提示', {
              distinguishCancelAndClose: true,
              confirmButtonText: this.action.pass,
              cancelButtonText: this.action.deny,
              type: 'info',
              center: 'true'
            })
              .then(_ => {
                dataNode[0].status = this.status.on.code
              })
              .catch(action => {
                if (action === 'cancel') {
                  dataNode[0].status = this.status.deny.code
                }
              })
          } else if (status === this.status.on.code) {
            this.$confirm(this.action.off, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info',
              center: 'true'
            })
              .then(_ => {
                dataNode[0].status = this.status.off.code
              })
              .catch(_ => {})
          } else if (status === this.status.off.code) {
            this.$confirm(this.action.on, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success',
              center: 'true'
            })
              .then(_ => {
                dataNode[0].status = this.status.on.code
              })
              .catch(_ => {})
          }
          return
        } else {
          idStatus = [{ id: row.apiRef, ownerId: row.id, status: row.status }]
        }
      }
      if (typeof status !== 'undefined') {
        this.checkbox = true
      } else {
        this.checkbox = false
      }
      this.filterArr = idStatus
      this.viewStatus = status
      this.dialog = true
      this.showTree = true
      this.showInfo = false
    },
    submit(i) {
      const ids = this.$refs.tree.getOwnerIds()
      const dataNodes = []
      if (ids && ids.length) {
        this.findItem(
          this.tableData,
          item => {
            return ids.indexOf(item.id) !== -1
          },
          dataNodes
        )
        if (i === this.status.approve.code) {
          dataNodes.forEach(e => {
            e.status = this.status.on.code
          })
        } else if (i === this.status.off.code) {
          dataNodes.forEach(e => {
            e.status = this.status.on.code
          })
        } else if (i === this.status.on.code) {
          dataNodes.forEach(e => {
            e.status = this.status.off.code
          })
        }
        this.dialog = false
      } else {
        this.$alert('不能为空！')
      }
    },
    findItem(arr, fn, dataNodes) {
      if (arr instanceof Array) {
        arr.forEach(item => {
          if (item.children) {
            this.findItem(item.children, fn, dataNodes)
          } else {
            if (fn(item)) {
              dataNodes.push(item)
            }
          }
        })
      }
    },
    filterStatus(value, row) {
      if (row.children) {
        return row.children.some(e => {
          return e.status === value
        })
      } else {
        if (row.status === value) {
          return true
        }
      }
      return false
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.children) {
        if (column.label === '接口url') {
          return [1, 3]
        } else if (column.label === '申请时间') {
          return [0, 0]
        } else if (column.label === '到期时间') {
          return [0, 0]
        }
      }
    },
    closeDialog(done) {
      done()
    },
    dialogBuSh(i) {
      if (i === this.viewStatus) {
        return true
      } else {
        return false
      }
    },
    commonShow(row, status) {
      if (row.children) {
        if (status === this.status.approve.code) {
          return false
        }
        const flag = row.children.some(e => {
          return e.status === status
        })
        if (flag) {
          return true
        }
      } else {
        if (row.status === status) {
          return true
        }
      }
      return false
    },
    lookShow(row) {
      if (row.children && row.children.length) {
        return true
      } else {
        return false
      }
    },
    show(row, col, status) {
      if (row.children) {
        const arr = row.children
        let a = 0
        let b = 0
        let c = 0
        let d = 0
        arr.forEach(element => {
          if (element.status === this.status.approve.code) {
            a++
          } else if (element.status === this.status.on.code) {
            b++
          } else if (element.status === this.status.off.code) {
            c++
          } else if (element.status === this.status.deny.code) {
            d++
          }
        })
        return this.status.approve.message + a + '、' +
                this.status.on.message + b + '、' +
                this.status.off.message + c + '、' +
                this.status.deny.message + d
      } else {
        if (status === this.status.approve.code) {
          return this.status.approve.message
        } else if (status === this.status.on.code) {
          return this.status.on.message
        } else if (status === this.status.off.code) {
          return this.status.off.message
        } else if (status === this.status.deny.code) {
          return this.status.deny.message
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      // if (!row.children) {
      //   if (row.status === this.status.deny.code) {
      //     return 'deny-row'
      //   } else if (row.status === this.status.on.code) {
      //     return 'on-row'
      //   } else if (row.status === this.status.off.code) {
      //     return 'off-row'
      //   } else if (row.status === this.status.approve.code) {
      //     return 'approve-row'
      //   }
      // }
      return ''
    },
    info(row) {
      this.dialog = true
      this.showTree = false
      this.showInfo = true
    }
  }
}
</script>
<style>
.el-table .deny-row {
  background: #f56c6c;
}
.el-table .on-row {
  background: #67c23a;
}
.el-table .off-row {
  background: #e6a23c;
}
.el-table .approve-row {
  background: #909399;
}
</style>
