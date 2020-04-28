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
      <el-table-column type="index" :index="1" />      
      <el-table-column prop="label" label="名称" />
      <el-table-column label="类型" width="80">
          <template slot-scope="scope">
            <el-tag>{{scope.row.children ? '申请' : '接口'}}</el-tag>
          </template>
        </el-table-column>
      <el-table-column label="接口url">
        <template slot-scope="scope">
          <el-button type="text" @click="info(scope.row)">{{ scope.row.uri }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" />
      <el-table-column prop="expireTime" label="到期时间" />
      <el-table-column
        prop="status"
        label="状态"
        :filters="[{ text: status.disabled.message, value: status.disabled.code }
                   , { text: status.expire.message, value: status.expire.code }
                   , { text: status.approve.message, value: status.approve.code }
                   , { text: status.deny.message, value: status.deny.code }
                   , { text: status.pass.message, value: status.pass.code }]"
        :filter-method="filterStatus"
        filter-placement="bottom-end"
        width="280"
      >
        <template slot-scope="scope">
            <span v-if="scope.row.children">
              <el-tag
                :type="tag_type(scope.row)"
                effect="dark">{{show(scope.row)}}</el-tag>
            </span>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="失效原因" />
      <el-table-column fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            v-if="commonShow(scope.row, 0)"
            type="primary"
            size="small"
            @click="commonAction(scope.row, 0)"
          >{{ action.approve }}</el-button>
          <!-- <el-button
            v-if="commonShow(scope.row, -1)"
            type="danger"
            size="small"
            @click="commonAction(scope.row, -1)"
          >{{ action.remove }}</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog ref="dialog" :visible.sync="dialog" :before-close="closeDialog" :center="true">
      <apiInfo :api="api" v-show="showInfo" />
    </el-dialog>
  </div>
</template>
<script>
import tree from './micro-service-tree'
import apiInfo from './api-info-view'
import {getUserApi} from '@/api/ms_user_api'
import {getAllService, updateService} from '@/api/ms_api'
import {getAllApply, passApply, denyApply} from '@/api/ms_apply'
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
        disabled: {
          code: -2,
          message: '已失效'
        },
        expire: {
          code: -1,
          message: '已过期'
        },
        approve: {
          code: 0,
          message: '待审批'
        },
        deny: {
          code: 1,
          message: '未通过'
        },
        pass: {
          code: 2,
          message: '已通过'
        }
      },
      action: {
        look: '查看',
        remove: '移除',
        approve: '审批',
        pass: '通过',
        deny: '拒绝'
      },
      text: '',
      api: {}
    }
  },
  inject: ['reload'],
  computed: {
    
  },
  created() {
    getAllApply().then(response => {
      this.tableData = response.data
    })
  },
  mounted() {
  },
  methods: {
    commonAction(row, status) {
      let idStatus = []
      if (row.children) {
        if (status === this.status.approve.code) {
            this.$confirm(this.action.approve, '提示', {
              distinguishCancelAndClose: true,
              confirmButtonText: this.action.pass,
              cancelButtonText: this.action.deny,
              type: 'info',
              center: 'true'
            })
              .then(_ => {
                passApply(row.id).then(_ => {
                  this.$message({
                    type: 'success',
                    message: '操作成功'
                  })
                  row.status = this.status.pass.code
                })
                .catch(res => {
                  if(res.code === 450)
                    this.reload()
                })
              })
              .catch(action => {
                if (action === 'cancel') {
                  denyApply(row.id).then(_ => {
                    this.$message({
                      type: 'success',
                      message: '操作成功'
                    })
                    row.status = this.status.deny.code
                  })
                  .catch(res => {
                    if(res.code === 450)
                      this.reload()
                  })
                }
              })
          }
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
        if(column.label === '接口url'){
          return [0,0]
        }else if(column.label === '申请时间'){
          return [1,2]
        }
      }else{
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
        return row.status === status
      }
      return false
    },
    show(row) {
      if (row.children) {
        if (row.status === this.status.disabled.code) {
          return this.status.disabled.message
        } else if (row.status === this.status.expire.code) {
          return this.status.expire.message
        } else if (row.status === this.status.approve.code) {
          return this.status.approve.message
        } else if (row.status === this.status.deny.code) {
          return this.status.deny.message
        } else if (row.status === this.status.pass.code) {
          return this.status.pass.message
        }
      }
    },
    tag_type(row){
      if (row.status === this.status.approve.code) {
        return 'primary'
      } else if (row.status === this.status.pass.code) {
        return 'success'
      } else if (row.status === this.status.deny.code) {
        return 'warning'
      } else if (row.status === this.status.expire.code){
        return 'info'
      } else if (row.status === this.status.disabled.code){
        return 'danger'
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
      this.api = row
      this.showTree = false
      this.showInfo = true
    }
  }
}
</script>
<style>
.el-table .expire-row {
  background: #f56c6c;
}
.el-table .on-row {
  background: #67c23a;
}
.el-table .off-row {
  background: #e6a23c;
}
</style>
