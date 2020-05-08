<template>
  <el-container>
    <el-header>
      <el-button type="primary" size="small" @click="updateService()">更新微服务信息</el-button>
      <el-button v-show="lookShow" type="primary" size="small" @click="commonAction()">{{ action.look }}</el-button>
      <el-button v-show="commonShow(0)" type="primary" size="small" @click="commonAction(0)">{{ action.join }}</el-button>
      <el-button v-show="commonShow(1)" type="success" size="small" @click="commonAction(1)">{{ action.on }}</el-button>
      <el-button v-show="commonShow(2)" type="warning" size="small" @click="commonAction(2)">{{ action.off }}</el-button>
      <el-button v-show="commonShow(-1)" type="danger" size="small" @click="commonAction(-1)">{{ action.remove }}</el-button>
    </el-header>
    <el-main>
      <el-table
        :data="tableData"
        :span-method="arraySpanMethod"
        row-key="id"
        border
        :row-class-name="tableRowClassName"
        style="width: 100%"
      >
        <el-table-column type="index" :index="1" />
        <el-table-column prop="label" label="名称" width="300" />
        <el-table-column label="类型" width="80">
          <template slot-scope="scope">
            <el-tag>{{scope.row.children ? '微服务' : '接口'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="接口url">
          <template slot-scope="scope">
            <span v-if="scope.row.children">{{ 'http://' + scope.row.host + scope.row.uri }}</span>
            <span v-else><el-button type="text" @click="info(scope.row)">{{ scope.row.uri }}</el-button></span>
          </template>
        </el-table-column>
        <el-table-column prop="sensitiveNum" label="敏感级别" width="80" />
        <el-table-column
          prop="status"
          label="状态"
          :filters="[{ text: status.join.message, value: status.join.code }
                     , { text: status.on.message, value: status.on.code }
                     , { text: status.off.message, value: status.off.code }
                     , { text: status.disabled.message, value: status.disabled.code }]"
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
        <el-table-column label="操作" width="350">
          <template slot-scope="scope">
            <el-row>
              <el-popover
                placement="right"
                width="300"
                trigger="click"
                v-model="scope.row.showPopover">
                <el-input-number v-model="num" controls-position="right" :min="0" :max="999"></el-input-number>
                <el-button type="primary" size="samll" @click="editSensitive(scope.row)">确认</el-button>
                <el-button
                  size="small"
                  slot="reference"
                  @click="numShow(scope.row)"
                >修改</el-button>
              </el-popover>
              <el-button
                v-if="commonShow(0, scope.row)"
                type="primary"
                size="small"
                @click="commonAction(0, scope.row)"
              >{{ action.join }}</el-button>
              <el-button
                v-if="commonShow(1, scope.row)"
                type="success"
                size="small"
                @click="commonAction(1, scope.row)"
              >{{ action.on }}</el-button>
              <el-button
                v-if="commonShow(2, scope.row)"
                type="warning"
                size="small"
                @click="commonAction(2, scope.row)"
              >{{ action.off }}</el-button>
              <el-button
                v-if="commonShow(-1, scope.row)"
                type="danger"
                size="small"
                @click="commonAction(-1, scope.row)"
              >{{ action.remove }}</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog ref="dialog" :visible.sync="dialog" :before-close="closeDialog" :center="true">
        <tree v-show="showTree" ref="tree" :filter-arr="filterArr" :checkbox="checkbox" :status="colorStatus" :data="tableData" />
        <span v-show="showTree" slot="footer">
          <el-button size="small" @click="dialog=false">取消</el-button>
          <el-button v-show="dialogBuSh(-1)" type="danger" size="small" @click="submit(-1)">{{ action.remove }}</el-button>
          <el-button v-show="dialogBuSh(0)" type="primary" size="small" @click="submit(0)">{{ action.join }}</el-button>
          <el-button v-show="dialogBuSh(1)" type="success" size="small" @click="submit(1)">{{ action.on }}</el-button>
          <el-button v-show="dialogBuSh(2)" type="warning" size="small" @click="submit(2)">{{ action.off }}</el-button>
        </span>
        <apiInfo :apiId="apiId" v-show="showInfo" />
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
      filterArr: [],
      dialog: false,
      showTree: false,
      showInfo: false,
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
        look: '查看',
        edit: '编辑',
        join: '接入',
        on: '启用',
        off: '停用',
        remove: '移除'
      },
      apiId: 0,
      num: 0
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
    numShow(row){
      if(row.children){
        let sensitiveNum = 0
        row.children.forEach(e => {
          if(e.sensitiveNum > sensitiveNum)
            sensitiveNum = e.sensitiveNum
        })
        this.num = sensitiveNum
      }else{
        this.num = row.sensitiveNum
      }
    },
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
          this.reload()
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        })
      })
    },
    editSensitive(row) {
      const ids = []
      if (row.children) {
        row.children.forEach(item => {
          ids.push(item.id)
        })
      } else {
        ids.push(row.id)
      }
      sensitiveService(this.num, ids).then(_ => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        if (row.children) {
          row.children.forEach(item => {
            item.sensitiveNum = this.num
          })
        } else {
          row.sensitiveNum = this.num      
        }
        row.showPopover = false
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
            this.$confirm(this.action.join, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info',
              center: 'true'
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
            this.$confirm(this.action.off, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: 'true'
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
            this.$confirm(this.action.on, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success',
              center: 'true'
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
            this.$confirm(this.action.remove, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error',
              center: 'true'
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
      this.showTree = true
      this.showInfo = false
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
          return [1, 2]
        } else if (column.label === '敏感级别') {
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
      this.dialog = true
      this.apiId = row.id
      this.showTree = false
      this.showInfo = true
    }
  },
  created() {
    getAllService().then(response => {
      this.tableData = response.data
      this.tableData.forEach(item => {
        this.$set(item, 'showPopover', false)
        if(item.children){
          item.children.forEach(item1 => {
            this.$set(item1, 'showPopover', false)
          })
        }
      })
    })
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
