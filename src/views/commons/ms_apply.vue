<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      row-key="id"
      border
      style="width: 100%"
    >
      <el-table-column type="index" :index="1" />
      <el-table-column type="expand">
        <template slot-scope="props">
          <!-- <div>
            <span>雨纷纷</span>
            <el-divider direction="vertical"></el-divider>
            <span>旧故里</span>
            <el-divider direction="vertical"></el-divider>
            <span>草木深</span>
            <el-divider></el-divider>
            <span>
              <span>雨纷纷</span>
              <el-divider direction="vertical"></el-divider>
              <span>旧故里</span>
              <el-divider direction="vertical"></el-divider>
              <span>草木深</span>
            </span>
          </div> -->
          <el-table
            :data="props.row.msApiDtos"
            :show-header="false"
            border
            style="width: 100%">
            <el-table-column type="index" :index="1" />
            <el-table-column
              prop="label"
              label="接口名">
            </el-table-column>
            <el-table-column label="接口url">
              <template slot-scope="scope">
                <el-button type="text" @click="info(scope.row)">{{ scope.row.uri }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" align="center" min-width="200" />
      <el-table-column prop="expireTime" label="到期时间" align="center" min-width="200" />   
      <el-table-column prop="label" label="申请用户" align="center" min-width="100" />
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        :filters="[{ text: status.disabled.message, value: status.disabled.code }
                   , { text: status.expire.message, value: status.expire.code }
                   , { text: status.approve.message, value: status.approve.code }
                   , { text: status.deny.message, value: status.deny.code }
                   , { text: status.pass.message, value: status.pass.code }]"
        :filter-method="filterStatus"
        filter-placement="bottom-end"
        min-width="100"
      >
        <template slot-scope="scope">
          <el-tag
            :type="tag_type(scope.row)"
            effect="dark">{{show(scope.row)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="失效原因" align="center" min-width="300" />
      <el-table-column v-if="hasPerm()" fixed="right" label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="commonShow(scope.row, status.approve.code)"
            type="primary"
            size="small"
            @click="commonAction(scope.row, action.approve.code)"
          >{{ action.approve.message }}</el-button>
          <el-button
            type="danger"
            size="small"
            @click="commonAction(scope.row, action.remove.code)"
          >{{ action.remove.message }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog ref="dialog" :visible.sync="dialog" title="接口详情信息" >
      <apiInfo :apiId="apiId" />
    </el-dialog>
  </div>
</template>
<script>
import tree from './micro-service-tree'
import apiInfo from './api-info-view'
import {getUserApi} from '@/api/ms_user_api'
import {getAllService, updateService} from '@/api/ms_api'
import {getAllApply, passApply, denyApply, delApply} from '@/api/ms_apply'
import { mapGetters } from 'vuex'
export default {
  components: {
    tree,
    apiInfo
  },
  data() {
    return {
      tableData: [],
      dialog: false,
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
        remove: {
          code: -1,
          message: '删除'
        },
        approve: {
          code: 0,
          message: '审批'
        },
        pass: {
          message: '通过'
        },
        deny: {
          message: '拒绝'
        }
      },
      text: '',
      apiId: 0
    }
  },
  inject: ['reload'],
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    getAllApply().then(response => {
      this.tableData = response.data
    })
  },
  mounted() {
  },
  methods: {
    hasPerm(){
      return this.roles.some(item => {
        return ['ADMIN', 'SUPER_ADMIN'].indexOf(item) !== -1
      })
    },
    commonAction(row, status) {
      let idStatus = []
      if (status === this.action.approve.code) {
          this.$confirm(this.action.approve.message + '用户申请', '提示', {
            distinguishCancelAndClose: true,
            confirmButtonText: this.action.pass.message,
            cancelButtonText: this.action.deny.message,
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
      } else if (status === this.action.remove.code) {
          this.$confirm('确认' + this.action.remove.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          })
          .then(_ => {
            delApply([row.id]).then(_ => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.removeItem(
                this.tableData,
                item => {
                  return item.id === row.id
                }
              )
            })
            .catch(res => {
              if(res.code === 450)
                this.reload()
            })
          })
          .catch(_ => {})
      }
    },
    removeItem(arr, fn) {
      return arr.some(item => {
        if (item.children) {
          return this.removeItem(item.children, fn)
        } else {
          if (fn(item)) {
            const i = arr.indexOf(item)
            arr.splice(i, 1)
            return true
          }
        }
      })
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
    dialogBuSh(i) {
      if (i === this.viewStatus) {
        return true
      } else {
        return false
      }
    },
    commonShow(row, status) {
      return row.status === status
    },
    show(row) {
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
    info(row) {
      this.dialog = true
      this.apiId = row.id
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
