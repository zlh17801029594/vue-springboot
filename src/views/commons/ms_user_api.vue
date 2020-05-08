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
            <el-tag>{{scope.row.children ? '用户' : '接口'}}</el-tag>
          </template>
        </el-table-column>
      <el-table-column label="接口url">
        <template slot-scope="scope">
          <el-button type="text" @click="info(scope.row)">{{ scope.row.apiUrl }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" />
      <el-table-column prop="expireTime" label="到期时间" />
      <el-table-column
        prop="status"
        label="状态"
        :filters="[{ text: status.on.message, value: status.on.code }
                   , { text: status.off.message, value: status.off.code }
                   , { text: status.expire.message, value: status.expire.code }]"
        :filter-method="filterStatus"
        filter-placement="bottom-end"
        width="280"
      >
        <template slot-scope="scope">
            <span v-if="scope.row.children">{{show(scope.row)}}</span>
            <span v-else>
              <el-tag
                :type="tag_type(scope.row)"
                effect="dark">{{show(scope.row)}}</el-tag>
            </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            v-if="lookShow(scope.row)"
            type="primary"
            size="small"
            @click="commonAction(scope.row)"
          >{{ action.look }}</el-button>
          <el-button
            v-if="commonShow(scope.row, -1)"
            type="danger"
            size="small"
            @click="commonAction(scope.row, -1)"
          >{{ action.remove }}</el-button>
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
          <span v-if="textShow(scope.row)">{{text(scope.row)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog ref="dialog" :visible.sync="dialog" :before-close="closeDialog" :center="true">
      <tree v-show="showTree" ref="tree" :filter-arr="filterArr" :checkbox="checkbox" :status="colorStatus"/>
      <span v-show="showTree" slot="footer">
        <el-button size="small" @click="dialog=false">取消</el-button>
        <el-button v-show="dialogBuSh(-1)" type="danger" size="small" @click="submit(-1)">{{ action.remove }}</el-button>
        <el-button v-show="dialogBuSh(1)" type="success" size="small" @click="submit(1)">{{ action.on }}</el-button>
        <el-button v-show="dialogBuSh(2)" type="warning" size="small" @click="submit(2)">{{ action.off }}</el-button>
      </span>
      <apiInfo :apiId="apiId" v-show="showInfo" />
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
      showTree: false,
      showInfo: false,
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
        look: '查看',
        remove: '移除',
        on: '启用',
        off: '停用',
      },
      apiId: 0
    }
  },
  inject: ['reload'],
  computed: {
    colorStatus() {
      return {
        red: this.status.disabled,
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
      if(row.children || row.apiStatus === 2 || row.status === -1){
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
        if (typeof status !== 'undefined') {
          childrenArr = childrenArr.filter(e => {
            if(e.apiStatus === 2 || e.status === -1)
              return e.status === status
          })
        }
        idStatus = childrenArr.map(e => {
          if(e.apiStatus === 2 || e.status === -1)
            return { id: e.apiId, ownerId: e.id, status: e.status }
          else
            return { id: e.apiId, ownerId: e.id, status: this.status.disabled.code }
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
          if (status === this.status.on.code) {
            this.$confirm(this.action.off, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: 'true'
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
          } else if (status === this.status.off.code) {
            this.$confirm(this.action.on, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success',
              center: 'true'
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
          } else if (status === this.status.expire.code) {
            this.$confirm(this.action.remove, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error',
              center: 'true'
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
        }
        return
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
        if (i === this.status.off.code) {
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
        } else if (i === this.status.on.code) {
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
        } else if (i === this.status.expire.code) {
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
        const flag = row.children.some(e => {
          if(e.apiStatus === 2 || status === -1)
            return e.status === status
        })
        if (flag) {
          return true
        }
      } else {
        if(row.apiStatus === 2 || status === -1)
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
    show(row) {
      if (row.children) {
        const arr = row.children
        let b = 0
        let c = 0
        let d = 0
        let x = 0
        arr.forEach(element => {
          if (element.apiStatus !== 2 && element.status !== this.status.expire.code){
            x++
          }else{
            if (element.status === this.status.on.code) {
              b++
            } else if (element.status === this.status.off.code) {
              c++
            } else if (element.status === this.status.expire.code) {
              d++
            }
          }
        })
        return this.status.on.message + b + '、' +
                this.status.off.message + c + '、' +
                this.status.expire.message + d + '、' +
                this.status.disabled.message + x
      } else {
        if (row.apiStatus !== 2 && row.status !== this.status.expire.code){
          return this.status.disabled.message
        }
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
      if (row.apiStatus !== 2 && row.status !== this.status.expire.code){
        return 'danger'
      }
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
      this.dialog = true
      this.apiId = row.apiId
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
