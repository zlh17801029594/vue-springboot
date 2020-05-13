<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      :span-method="arraySpanMethod"
      row-key="id"
      :row-class-name="tableRowClassName"
      border
      :indent="0"
      style="width: 100%"
    >
      <!-- <el-table-column type="index" :index="1" /> -->
      <el-table-column width="48" />      
      <el-table-column prop="label" label="用户名/接口名称" align="center" min-width="180" />
      <el-table-column label="类型" align="center" min-width="70">
          <template slot-scope="scope">
            <el-tag>{{scope.row.children ? '用户' : '接口'}}</el-tag>
          </template>
        </el-table-column>
      <el-table-column label="用户敏感级别/接口url" align="center" min-width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.children">{{scope.row.sensitive}}</span>
          <el-button v-else type="text" @click="info(scope.row)">{{ scope.row.apiUrl }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" align="center" min-width="200" />
      <el-table-column prop="expireTime" label="到期时间" align="center" min-width="200" />
      <el-table-column
        prop="status"
        label="状态"
        :filters="[{ text: status.on.message, value: status.on.code }
                   , { text: status.off.message, value: status.off.code }
                   , { text: status.expire.message, value: status.expire.code }]"
        :filter-method="filterStatus"
        filter-placement="bottom-end"
        align="center"
        min-width="280"
      >
        <template slot-scope="scope">
            <span v-if="scope.row.children">{{show(scope.row)}}</span>
            <span v-else>
              <el-tag
                :type="tag_type(scope.row)"
                effect="dark">{{show(scope.row)}}</el-tag>
              <el-tag
                v-if="scope.row.apiStatus !== 2 && scope.row.status !== status.expire.code"
                type="danger"
                effect="dark">{{status.disabled.message}}</el-tag>
            </span>
        </template>
      </el-table-column>
      <el-table-column label="失效原因" align="center" min-width="150">
        <template slot-scope="scope">
          <span v-if="textShow(scope.row)">{{text(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button
            v-if="lookShow(scope.row)"
            type="primary"
            size="small"
            @click="commonAction(scope.row, action.look.code)"
          >{{ action.look.message }}</el-button>
          <el-button
            v-if="commonShow(scope.row, status.off.code)"
            type="success"
            size="small"
            @click="commonAction(scope.row, action.on.code)"
          >{{ action.on.message }}</el-button>
          <el-button
            v-if="commonShow(scope.row, status.on.code)"
            type="warning"
            size="small"
            @click="commonAction(scope.row, action.off.code)"
          >{{ action.off.message }}</el-button>
          <!-- v-if="commonShow(scope.row, status.expire.code)" -->
          <el-button
            v-if="removeShow(scope.row)"
            type="danger"
            size="small"
            @click="commonAction(scope.row, action.remove.code)"
          >{{ action.remove.message }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog ref="dialog" :visible.sync="dialog" :before-close="closeDialog" :center="true" width="500px">
      <tree ref="tree" :filter-arr="filterArr" :checkbox="checkbox" :status="colorStatus"/>
      <span slot="footer">
        <el-button size="small" @click="dialog=false">取消</el-button>
        <el-button v-show="dialogBuSh(action.remove.code)" type="danger" size="small" @click="submit(action.remove.code)">{{ action.remove.message }}</el-button>
        <el-button v-show="dialogBuSh(action.on.code)" type="success" size="small" @click="submit(action.on.code)">{{ action.on.message }}</el-button>
        <el-button v-show="dialogBuSh(action.off.code)" type="warning" size="small" @click="submit(action.ff.code)">{{ action.off.message }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialog3" title="接口详情信息">
        <apiInfo :apiId="apiId" />
    </el-dialog>
  </div>
</template>
<script>
import tree from './micro-service-tree'
import apiInfo from './api-info-view'
import {getUserApi, onUserApi, offUserApi, delUserApi} from '@/api/ms_user_api'
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
      dialog3: false,
      viewStatus: 0,
      checkbox: true,
      status: {
        disabled: {
          code: -2,
          message: '暂失效'
        },
        expire: {
          code: -1,
          message: '已过期'
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
        look: {
          code: 0,
          message: '查看'
        },
        remove: {
          code: -1,
          message: '移除'
        },
        on: {
          code: 2,
          message: '启用'
        },
        off: {
          code: 1,
          message: '停用'
        },
      },
      apiId: 0
    }
  },
  inject: ['reload'],
  computed: {
    colorStatus() {
      return {
        // red: this.status.disabled,
        gray: this.status.expire,
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
    textShow(row){
      if(row.children || row.apiStatus === 2 || row.status === this.status.expire.code){
        return false
      }
      return true
    },
    text(row){
      if(row.apiStatus === 1){
        return '接口已停用'
      } else if(row.apiStatus === 0){
        return '接口待接入'
      } else if(row.apiStatus === -1){
        return '接口未生效'
      } else if(row.apiStatus === 3){
        return '用户敏感级别不足'
      }
    },
    commonAction(row, status) {
      let idStatus = []
      if (row.children) {
        let childrenArr = row.children
        //  && status !== this.action.remove.code
        if (status !== this.action.look.code && status !== this.action.remove.code) {
          childrenArr = childrenArr.filter(e => {
            // if(e.apiStatus === 2 || e.status === this.status.expire.code){
              if(status === this.action.on.code){
                return e.status === this.status.off.code
              }else if(status === this.action.off.code){
                return e.status === this.status.on.code
              }else if(status === this.action.remove.code){
                return e.status === this.status.expire.code
              }
            // }
          })
        }
        idStatus = childrenArr.map(e => {
          if(e.apiStatus === 2 || e.status === this.status.expire.code)
            return { id: e.apiId, ownerId: e.id, status: e.status }
          else
            return { id: e.apiId, ownerId: e.id, status: e.status, enable: true }
        })
      } else {
        // 单条数据不展示树结构
        const dataNode = []
        this.findItem(
          this.tableData,
          item => {
            return item.id === row.id
          },
          dataNode
        )
        if (status === this.action.off.code) {
          this.$confirm('确认' + this.action.off.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(_ => {
              offUserApi([row.id]).then(_ => {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                dataNode[0].status = this.status.off.code
              })
              .catch(res => {
                if(res.code === 450)
                  this.reload()
              })
            })
            .catch(_ => {})
        } else if (status === this.action.on.code) {
          this.$confirm('确认' + this.action.on.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          })
            .then(_ => {
              onUserApi([row.id]).then(_ => {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                dataNode[0].status = this.status.on.code
              })
              .catch(res => {
                if(res.code === 450)
                  this.reload()
              })
            })
            .catch(_ => {})
        } else if (status === this.action.remove.code) {
          this.$confirm('确认' + this.action.remove.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          })
            .then(_ => {
              delUserApi([row.id]).then(_ => {
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
        return
      }
      if (status !== this.action.look.code) {
        this.checkbox = true
      } else {
        this.checkbox = false
      }
      this.filterArr = idStatus
      this.viewStatus = status
      this.dialog = true
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
        if (i === this.action.on.code) {
          onUserApi(ids).then(_ => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            dataNodes.forEach(e => {
              e.status = this.status.on.code
            })
          })
          .catch(res => {
              if(res.code === 450)
                this.reload()
            })
        } else if (i === this.action.off.code) {
          offUserApi(ids).then(_ => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            dataNodes.forEach(e => {
              e.status = this.status.off.code
            })
          })
          .catch(res => {
                  if(res.code === 450)
                    this.reload()
                })
        } else if (i === this.action.remove.code) {
          delUserApi(ids).then(_ => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            ids.forEach(id => {
              this.removeItem(
                this.tableData,
                item => {
                  return item.id === id
                }
              )
            })
          })
          .catch(res => {
                  if(res.code === 450)
                    this.reload()
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
        if (column.label === '申请时间') {
          return [1, 2]
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
        const flag = row.children.some(e => {
          // if(e.apiStatus === 2 || status === this.status.expire.code)
            return e.status === status
        })
        if (flag) {
          return true
        }
      } else {
        // if(row.apiStatus === 2 || status === this.status.expire.code)
          return row.status === status
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
    removeShow(row) {
      if (row.children && !row.children.length) {
        return false
      } else {
        return true
      }
    },
    show(row) {
      if (row.children) {
        const arr = row.children
        let b = 0
        let c = 0
        let d = 0
        // let x = 0
        arr.forEach(element => {
          // if (element.apiStatus !== 2 && element.status !== this.status.expire.code){
          //   x++
          // }else{
            if (element.status === this.status.on.code) {
              b++
            } else if (element.status === this.status.off.code) {
              c++
            } else if (element.status === this.status.expire.code) {
              d++
            }
          // }
        })
        return this.status.on.message + b + '、' +
                this.status.off.message + c + '、' +
                this.status.expire.message + d
                //  + '、' +
                // this.status.disabled.message + x
      } else {
        // if (row.apiStatus !== 2 && row.status !== this.status.expire.code){
        //   return this.status.disabled.message
        // }
        if (row.status === this.status.on.code) {
          return this.status.on.message
        } else if (row.status === this.status.off.code) {
          return this.status.off.message
        } else if (row.status === this.status.expire.code) {
          return this.status.expire.message
        }
      }
    },
    tag_type(row){
      // if (row.apiStatus !== 2 && row.status !== this.status.expire.code){
      //   return 'danger'
      // }
      if (row.status === this.status.on.code) {
        return 'success'
      } else if (row.status === this.status.off.code) {
        return 'warning'
      } else if (row.status === this.status.expire.code) {
        return 'info'
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
      this.apiId = row.apiId
      this.dialog3 = true
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
