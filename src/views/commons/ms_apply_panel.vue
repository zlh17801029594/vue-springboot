<template>
  <div>
    <el-table
      v-loading="loading"
      :data="tableData"
      element-loading-text="加载中..."
      row-key="id"
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        label="序号"
        type="index"
        :index="1"
        width="55"
        align="center"
      />
      <el-table-column prop="applyTime" label="申请时间" align="center" min-width="200" />
      <el-table-column prop="expireTime" label="到期时间" align="center" min-width="200" />
      <el-table-column prop="username" label="申请用户" align="center" min-width="100" />
      <el-table-column
        prop="status"
        label="申请状态"
        align="center"
        min-width="100"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status | applyStyle" :effect="row.status !== 2 ? 'dark' : 'light'">
            {{ row.status | applyStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="type === 'disabled'" prop="reason" label="失效原因" align="center" min-width="300" />
      <el-table-column fixed="right" label="操作" align="center" width="161">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="look(scope.row)"
          >{{ action.look.message }}</el-button>
          <el-button
            v-if="commonShow(scope.row, 0)"
            type="primary"
            size="small"
            @click="approve(scope.row)"
          >{{ action.approve.message }}</el-button>
          <el-button
            v-if="scope.row.status !== 0"
            type="danger"
            size="small"
            @click="remove(scope.row)"
          >{{ action.remove.message }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog ref="dialog" :visible.sync="dialog" :before-close="closeDialog" :center="true" @open="openDialog">
      <el-table
        ref="apiTable"
        :key="key"
        :data="apiData"
        tooltip-effect="light"
        size="mini"
        border
        highlight-current-row
        @selection-change="handleSelection"
      >
        <el-table-column v-if="checkbox" type="selection" />
        <el-table-column label="序号" type="index" :index="1" width="55" align="center" />
        <el-table-column label="接口名称" prop="apiName" align="center" min-width="100" show-overflow-tooltip />
        <el-table-column label="接口url" align="center" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button v-if="scope.row.apiId" type="text" @click="info(scope.row)">{{ scope.row.apiUrl }}</el-button>
            <span v-else style="font-size: 14px; line-height: 36px">{{ scope.row.apiUrl }}</span>
          </template>
        </el-table-column>
        <el-table-column label="请求方式" prop="apiHttpMethod" align="center" min-width="100" />
        <el-table-column v-if="passSome" label="审批状态" prop="status" align="center" min-width="80">
          <template slot-scope="{row}">
            <el-tag :type="row.status | filterType" effect="dark">
              {{ row.status | filterStatus }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <!-- <el-button size="small" @click="dialog=false">取消</el-button> -->
        <el-button v-show="checkbox" type="warning" size="small" @click="deny">{{ action.deny.message }}</el-button>
        <el-button v-show="checkbox" type="success" size="small" :disabled="buttonEnable" :plain="!buttonStyle" @click="pass">{{ action.pass.message }}</el-button>
      </span>
    </el-dialog>
    <el-dialog ref="dialog2" :visible.sync="dialog2" title="接口详情信息">
      <apiInfo v-if="api" :api="api" />
    </el-dialog>
  </div>
</template>
<script>
import tree from './micro-service-tree'
import apiInfo from './api-info-view'
import { getUserApi } from '@/api/ms_user_api'
import { getServiceById } from '@/api/ms_api'
import { getAllApply, passApply, denyApply, passApplySome, delApply } from '@/api/ms_apply'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
const applyStyle = {
  '1': 'warning',
  '2': 'success',
  '3': 'success',
  '-1': 'info',
  '-2': 'danger'
}
const applyStatus = {
  '1': '未通过',
  '2': '部分通过',
  '3': '全部通过',
  '0': '待审批',
  '-1': '已过期',
  '-2': '已失效'
}
const passSomeType = {
  'false': 'warning',
  'true': 'success'
}
const passSomeStatus = {
  'false': '拒绝',
  'true': '通过'
}
export default {
  name: 'TabPane',
  components: {
    tree,
    apiInfo,
    Pagination
  },
  filters: {
    applyStyle(status) {
      return applyStyle[status]
    },
    applyStatus(status) {
      return applyStatus[status]
    },
    filterType(status) {
      return passSomeType[status]
    },
    filterStatus(status) {
      return passSomeStatus[status]
    }
  },
  props: {
    type: {
      type: String,
      default: 'approve'
    }
  },
  data() {
    return {
      tableData: [],
      dialog2: false,
      dialog: false,
      apiData: [],
      checkbox: false,
      selection: [],
      passSome: false,
      key: 1,
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
        passSome: {
          code: 2,
          message: '部分通过'
        },
        pass: {
          code: 3,
          message: '全部通过'
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
        },
        look: {
          message: '查看'
        }
      },
      api: undefined,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        data: {
          status: 0
        }
      },
      loading: true
    }
  },
  inject: ['reload'],
  computed: {
    status1() {
      return this.status[this.type].code
    },
    buttonStyle() {
      return this.selection.length === this.apiData.length
    },
    buttonEnable() {
      return !this.selection.length
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    deny() {
      denyApply(this.key).then(_ => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        // row.status = this.status.deny.code
        this.removeItem(
          this.tableData,
          item => {
            return item.id === this.key
          }
        )
        this.dialog = false
      })
        .catch(res => {
          if (res.code === 450) {
            this.getList()
            this.dialog = false
          }
        })
      console.log('/apply/deny/{id}')
    },
    pass() {
      if (this.buttonStyle) {
        passApply(this.key).then(_ => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.removeItem(
            this.tableData,
            item => {
              return item.id === this.key
            }
          )
          this.dialog = false
        }).catch(res => {
          if (res.code === 450) {
            this.getList()
            this.dialog = false
          }
        })
        console.log('/apply/pass/{id}')
      } else {
        const applydetailss = this.selection.map(item => {
          return {
            id: item.id
          }
        })
        const apply = {
          id: this.key,
          applyDetailss: applydetailss
        }
        passApplySome(apply).then(_ => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.removeItem(
            this.tableData,
            item => {
              return item.id === this.key
            }
          )
          this.dialog = false
        }).catch(res => {
          if (res.code === 450) {
            this.getList()
            this.dialog = false
          }
        })
        console.log('/apply/pass-some-api', this.selection.map(item => item.id))
      }
    },
    openDialog() {
      console.log(this.$refs.apiTable)
      // 直接设置会报undefined异常 Cannot read property 'toggleAllSelection' of undefined
      // this.$refs.apiTable.toggleAllSelection()
      setTimeout(() => {
        if (this.checkbox) {
          this.$refs.apiTable.clearSelection()
          this.$refs.apiTable.toggleAllSelection()
        }
      }, 100)
      // this.$nextTick(() => {
      //   this.$refs.apiTable.toggleAllSelection()
      // })
    },
    handleSelection(selection) {
      console.log(selection)
      this.selection = selection
    },
    look(row) {
      // 保证每次渲染表格
      this.key = row.id
      this.checkbox = false
      this.apiData = row.applyDetailss
      if (row.status === 2) {
        this.passSome = true
      }
      this.dialog = true
    },
    approve(row) {
      // 保证每次渲染表格
      this.key = row.id
      this.checkbox = true
      this.apiData = row.applyDetailss
      this.dialog = true
    },
    remove(row) {
      this.$confirm('确认' + this.action.remove.message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(_ => {
          delApply(row.id).then(_ => {
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
              if (res.code === 450) { this.getList() }
            })
        })
        .catch(_ => {})
    },
    closeDialog(done) {
      this.passSome = false
      done()
    },
    async getList() {
      this.loading = true
      this.listQuery.data.status = this.status1
      console.log(this.listQuery)
      await getAllApply(this.listQuery).then(response => {
        this.tableData = response.data.list
        this.total = response.data.total
      }).catch(_ => {
      })
      this.loading = false
    },
    removeItem(arr, fn) {
      arr.forEach(item => {
        if (fn(item)) {
          const i = arr.indexOf(item)
          arr.splice(i, 1)
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
    tag_type(row) {
      if (row.status === this.status.approve.code) {
        return 'primary'
      } else if (row.status === this.status.pass.code) {
        return 'success'
      } else if (row.status === this.status.deny.code) {
        return 'warning'
      } else if (row.status === this.status.expire.code) {
        return 'info'
      } else if (row.status === this.status.disabled.code) {
        return 'danger'
      }
    },
    async info(row) {
      if (!row.api) {
        await getServiceById(row.apiId).then(response => {
          this.$set(row, 'api', response.data)
        }).catch(_ => {

        })
      }
      this.api = row.api
      if (this.api) {
        this.dialog2 = true
      }
    }
  }
}
</script>
