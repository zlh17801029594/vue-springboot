<template>
  <el-container>
    <el-header>
      <el-button type="primary" size="small" @click="updateService()">更新微服务信息</el-button>
      <el-button v-show="lookShow" type="primary" size="small" @click="commonAction()">{{ action.look.message }}</el-button>
      <el-button v-show="commonShow(0)" type="primary" size="small" @click="commonAction(0)">{{ action.join.message }}</el-button>
      <el-button v-show="commonShow(1)" type="success" size="small" @click="commonAction(1)">{{ action.on.message }}</el-button>
      <el-button v-show="commonShow(2)" type="warning" size="small" @click="commonAction(2)">{{ action.off.message }}</el-button>
      <el-button v-show="commonShow(-1)" type="danger" size="small" @click="commonAction(-1)">{{ action.remove.message }}</el-button>
    </el-header>
    <el-main>
      <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="加载中..."
        row-key="id"
        :indent="0"
        border
        highlight-current-row
        :row-class-name="tableRowClassName"
        style="width: 100%"
      >
        <!-- <el-table-column type="index" :index="1" /> -->
        <!-- <el-table-column
          type="selection"
          width="55">
        </el-table-column> -->
        <el-table-column width="48" />
        <el-table-column prop="name" label="微服务/接口名称" align="center" min-width="250" />
        <el-table-column label="类型" align="center" min-width="80">
          <template slot-scope="scope">
            <el-tag>{{scope.row.children ? '微服务' : '接口'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="接口url" align="center" min-width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.children">{{ 'http://' + scope.row.host + scope.row.url }}</span>
            <span v-else><el-button type="text" @click="info(scope.row)">{{ scope.row.url }}</el-button></span>
          </template>
        </el-table-column>
        <el-table-column prop="httpMethod" label="请求方式" align="center" min-width="80" />
        <el-table-column prop="sensitiveNum" label="敏感级别" align="center" min-width="80" />
        <el-table-column
          prop="status"
          label="状态"
          :filters="[{ text: status.join.message, value: status.join.code }
                     , { text: status.on.message, value: status.on.code }
                     , { text: status.off.message, value: status.off.code }
                     , { text: status.disabled.message, value: status.disabled.code }]"
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
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="360">
          <template slot-scope="scope">
            <el-row>
              <el-button
                size="small"
                @click="editAction(scope.row)"
              >修改</el-button>
              <el-button
                v-if="commonShow(0, scope.row)"
                type="primary"
                size="small"
                @click="commonAction(0, scope.row)"
              >{{ action.join.message }}</el-button>
              <el-button
                v-if="commonShow(1, scope.row)"
                type="success"
                size="small"
                @click="commonAction(1, scope.row)"
              >{{ action.on.message }}</el-button>
              <el-button
                v-if="commonShow(2, scope.row)"
                type="warning"
                size="small"
                @click="commonAction(2, scope.row)"
              >{{ action.off.message }}</el-button>
              <el-button
                v-if="commonShow(-1, scope.row)"
                type="danger"
                size="small"
                @click="commonAction(-1, scope.row)"
              >{{ action.remove.message }}</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog ref="dialog" :visible.sync="dialog" :before-close="closeDialog" :center="true" width="500px">
        <tree ref="tree" :filter-arr="filterArr" :checkbox="checkbox" :status="colorStatus" />
        <span slot="footer">
          <el-button size="small" @click="dialog=false">取消</el-button>
          <el-button v-show="dialogBuSh(-1)" type="danger" size="small" @click="submit(-1)">{{ action.remove.message }}</el-button>
          <el-button v-show="dialogBuSh(0)" type="primary" size="small" @click="submit(0)">{{ action.join.message }}</el-button>
          <el-button v-show="dialogBuSh(1)" type="success" size="small" @click="submit(1)">{{ action.on.message }}</el-button>
          <el-button v-show="dialogBuSh(2)" type="warning" size="small" @click="submit(2)">{{ action.off.message }}</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="dialog2" title="更新接口敏感级别" width="400px" >
        <el-form :model="dialog2Form" ref="dialog2Form" label-width="120px" label-position="left">
          <el-form-item label="敏感级别" >
            <el-input-number v-model="dialog2Form.sensitiveNum" controls-position="right" :min="0" :max="999"></el-input-number>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button size="small" @click="dialog2=false">取消</el-button>
          <el-button type="primary" size="samll" @click="editSensitive()">确认</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="dialog3" title="接口详情信息">
        <apiInfo :apiId="apiId" />
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import tree from './micro-service-tree'
import apiInfo from './api-info-view'
import {getAllService, joinService, delService, onService, offService, sensitiveService, updateService} from '@/api/ms_api'
export default {
  components: {
    tree,
    apiInfo
  },
  data() {
    return {
      tableData: [],
      loading: true,
      filterArr: [],
      dialog: false,
      dialog3: false,
      viewStatus: 0,
      checkbox: true,
      status: {
        disabled: {
          code: -1,
          message: '未生效'
        },
        join: {
          code: 0,
          message: '待接入'
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
          code: 3,
          message: '查看'
        },
        edit: {
          code: 4,
          message: '编辑'
        },
        join: {
          code: 0,
          message: '接入'
        },
        on: {
          code: 2,
          message: '启用'
        },
        off: {
          code: 1,
          message: '停用'
        },
        remove: {
          code: -1,
          message: '移除'
        }
      },
      apiId: 0,
      dialog2: false,
      dialog2Form: {
        row: undefined,
        sensitiveNum: 0
      }
    }
  },
  inject: ['reload'],
  computed: {
    colorStatus() {
      return {
        gray: this.status.disabled,
        blue: this.status.join,
        orange: this.status.off,
        green: this.status.on
      }
    }
  },
  methods: {
    updateService(){
      this.$prompt(
        '网关地址',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: 'http://192.168.243.87:8080/v2/api-docs'
        }
      ).then(({ value }) => {
        updateService(value).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        })
      }).catch(() => {
        
      })
    },
    editAction(row) {
      if(row.children){
        let sensitiveNum = 0
        row.children.forEach(e => {
          if(e.sensitiveNum > sensitiveNum)
            sensitiveNum = e.sensitiveNum
        })
        this.dialog2Form.sensitiveNum = sensitiveNum
      }else{
        this.dialog2Form.sensitiveNum = row.sensitiveNum
      }
      this.dialog2Form.row = row
      this.dialog2 = true
    },
    editSensitive() {
      const row = this.dialog2Form.row
      const num = this.dialog2Form.sensitiveNum
      const ids = []
      if (row.children) {
        row.children.forEach(item => {
          ids.push(item.id)
        })
      } else {
        ids.push(row.id)
      }
      sensitiveService(num, ids).then(_ => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        if (row.children) {
          row.children.forEach(item => {
            item.sensitiveNum = num
          })
        } else {
          row.sensitiveNum = num      
        }
        this.dialog2 = false
      })
      .catch(res => {
        if(res.code === 450)
          this.reload()
      })
    },
    commonAction(status, row) {
      let idStatus
      if (!row) {
        row = this.tableData
      }
      const childrenArr = row.children || row
      if (childrenArr instanceof Array) {
        const displayNodes = []
        if (typeof status !== 'undefined') {
          this.findItems(
            childrenArr,
            item => {
              return item.status === status
            },
            displayNodes
          )
        } else {
          this.findItems(
            childrenArr,
            item => {
              return typeof item.children === 'undefined'
            },
            displayNodes
          )
        }
        idStatus = displayNodes.map(e => {
          return { id: e.id, status: e.status }
        })
      } else {
        // 单条数据不展示树结构
        if (typeof status !== 'undefined') {
          const dataNode = []
          this.findItems(
            this.tableData,
            item => {
              return item.id === row.id
            },
            dataNode
          )
          if (status === this.status.join.code) {
            this.$confirm('确认' + this.action.join.message, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            })
              .then(_ => {
                joinService([row.id]).then(_ => {
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
              .catch(action => {
              })
          } else if (status === this.status.on.code) {
            this.$confirm('确认' + this.action.off.message, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(_ => {
                offService([row.id]).then(_ => {
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
            this.$confirm('确认' + this.action.on.message, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            })
              .then(_ => {
                onService([row.id]).then(_ => {
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
          } else if (status === this.status.disabled.code) {
            this.$confirm('确认' + this.action.remove.message, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            })
              .then(_ => {
                delService([row.id]).then(_ => {
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
                  const parentNode = []
                  this.findItems(
                    this.tableData,
                    item => {
                      return item.id === dataNode[0].pid
                    },
                    parentNode
                  )
                  if(!parentNode[0].children.length){
                    this.removeItem(
                      this.tableData,
                      item => {
                        return item.id === parentNode[0].id
                      }
                    )
                  }
                })
                .catch(res => {
                  if(res.code === 450)
                    this.reload()
                })
              })
              .catch(_ => {})
          }
          return
        } else {
          idStatus = [{ id: row.id, status: row.status }]
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
    },
    submit(i) {
      const ids = this.$refs.tree.getIds()
      const dataNodes = []
      if (ids && ids.length) {
        this.findItems(
          this.tableData,
          item => {
            return ids.indexOf(item.id) !== -1
          },
          dataNodes
        )
        if (i === this.status.join.code) {
          joinService(ids).then(_ => {
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
        } else if (i === this.status.off.code) {
          onService(ids).then(_ => {
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
          offService(ids).then(_ => {
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
        } else if (i === this.status.disabled.code) {
          delService(ids).then(_ => {
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
            const parentNode = []
            this.findItems(
              this.tableData,
              item => {
                return item.id === dataNodes[0].pid
              },
              parentNode
            )
            if(!parentNode[0].children.length){
              this.removeItem(
                this.tableData,
                item => {
                  return item.id === parentNode[0].id
                }
              )
            }
          })
          .catch(res => {
                  if(res.code === 450)
                    this.reload()
                })
        }
        this.dialog = false
      } else {
        console.log(ids)
        this.$alert('不能为空！')
      }
    },
    findItems(arr, fn, dataNodes) {
      arr.forEach(item => {
        if (item.children) {
          if (fn(item)) {
            dataNodes.push(item)
          }
          this.findItems(item.children, fn, dataNodes)
        } else {
          if (fn(item)) {
            dataNodes.push(item)
          }
        }
      })
    },
    hasItem(arr, fn) {
      return arr.some(item => {
        if (item.children) {
          return this.hasItem(item.children, fn)
        } else {
          if (fn(item)) {
            return true
          }
        }
      })
    },
    removeItem(arr, fn) {
      return arr.some(item => {
        if (item.children) {
          if (fn(item)) {
            const i = arr.indexOf(item)
            arr.splice(i, 1)
            return true
          }else{
            return this.removeItem(item.children, fn)
          }
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
    commonShow(status, row) {
      if (!row) {
        row = this.tableData
      }
      const childrenArr = row.children || row
      if (childrenArr instanceof Array) {
        const flag = this.hasItem(
          childrenArr,
          item => {
            return item.status === status
          }
        )
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
    lookShow() {
      return this.tableData && this.tableData.length
    },
    show(row) {
      if (row.children) {
        const arr = row.children
        let a = 0
        let b = 0
        let c = 0
        let d = 0
        arr.forEach(element => {
          if (element.status === this.status.join.code) {
            a++
          } else if (element.status === this.status.on.code) {
            b++
          } else if (element.status === this.status.off.code) {
            c++
          } else if (element.status === this.status.disabled.code) {
            d++
          }
        })
        return this.status.join.message + a + '、' +
                this.status.on.message + b + '、' +
                this.status.off.message + c + '、' +
                this.status.disabled.message + d
      } else {
        if (row.status === this.status.join.code) {
          return this.status.join.message
        } else if (row.status === this.status.on.code) {
          return this.status.on.message
        } else if (row.status === this.status.off.code) {
          return this.status.off.message
        } else if (row.status === this.status.disabled.code) {
          return this.status.disabled.message
        }
      }
    },
    tag_type(row){
      if (row.status === this.status.join.code) {
        return 'primary'
      } else if (row.status === this.status.on.code) {
        return 'success'
      } else if (row.status === this.status.off.code) {
        return 'warning'
      } else if (row.status === this.status.disabled.code) {
        return 'info'
      }
    },
    tableRowClassName({ row, rowIndex }) {
      // if (!row.children) {
      //   if (row.status === this.status.disabled.code) {
      //     return 'deny-row'
      //   } else if (row.status === this.status.on.code) {
      //     return 'on-row'
      //   } else if (row.status === this.status.off.code) {
      //     return 'off-row'
      //   } else if (row.status === this.status.join.code) {
      //     return 'approve-row'
      //   }
      // }
      return ''
    },
    info(row) {
      if(row.children){
        return
      }
      this.dialog3 = true
      this.apiId = row.id
    },
    getList(){
      this.loading = true
      getAllService().then(response => {
        this.tableData = response.data
        this.loading = false
      }).catch(_ => {
        this.loading = false
      })
    }
  },
  created() {
    this.getList()
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
.el-header {
  line-height: 60px;
}
.el-main {
  padding: 0 20px;
}
</style>
