<template>
  <el-container>
    <el-header>
      <el-button type="primary" size="small" @click="updateService()">更新微服务信息</el-button>
      <el-button v-show="tableData && tableData.length" size="small" @click="editAllAction()">{{ action.edit.message }}</el-button>
      <el-button v-show="tableData && tableData.length" type="primary" size="small" @click="commonAllAction(action.look.code)">{{ action.look.message }}</el-button>
      <el-button v-show="commonAllShow(status.join.code)" type="primary" size="small" @click="commonAllAction(action.join.code)">{{ action.join.message }}</el-button>
      <el-button v-show="commonAllShow(status.off.code)" type="success" size="small" @click="commonAllAction(action.on.code)">{{ action.on.message }}</el-button>
      <el-button v-show="commonAllShow(status.on.code)" type="warning" size="small" @click="commonAllAction(action.off.code)">{{ action.off.message }}</el-button>
      <el-button v-show="commonAllShow(status.disabled.code)" type="danger" size="small" @click="commonAllAction(action.remove.code)">{{ action.remove.message }}</el-button>
    </el-header>
    <el-main>
      <el-table
        v-loading="loading"
        :data="tableData"
        element-loading-text="加载中..."
        row-key="id"
        :indent="0"
        border
        highlight-current-row
        default-expand-all
        style="width: 100%"
      >
        <el-table-column width="48" />
        <el-table-column prop="name" label="微服务/接口名称" align="center" min-width="250" show-overflow-tooltip />
        <el-table-column label="类型" align="center" min-width="80">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.children ? '微服务' : '接口' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="接口url" align="center" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="info(scope.row)">{{ scope.row.type ? scope.row.url : 'http://' + scope.row.host + scope.row.url }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="httpMethod" label="请求方式" align="center" min-width="80" />
        <el-table-column prop="sensitiveNum" label="敏感级别" align="center" min-width="80" />
        <el-table-column
          prop="status"
          label="接口状态"
          align="center"
          min-width="280"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.children">{{ show(scope.row) }}</span>
            <span v-else>
              <el-tag
                :type="tag_type(scope.row)"
                effect="dark"
              >{{ show(scope.row) }}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="427">
          <template slot-scope="scope">
            <el-row>
              <el-button
                size="small"
                @click="editAction(scope.row)"
              >{{ action.edit.message }}</el-button>
              <el-button
                v-if="scope.row.children"
                type="primary"
                size="small"
                @click="commonAction(scope.row, action.look.code)"
              >{{ action.look.message }}</el-button>
              <el-button
                v-if="commonShow(scope.row, status.join.code)"
                type="primary"
                size="small"
                @click="commonAction(scope.row, action.join.code)"
              >{{ action.join.message }}</el-button>
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
              <el-button
                v-if="commonShow(scope.row, status.disabled.code)"
                type="danger"
                size="small"
                @click="commonAction(scope.row, action.remove.code)"
              >{{ action.remove.message }}</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog ref="dialog" :visible.sync="dialog" :center="true" width="600px">
        <tree ref="tree" :tree-data="filterArr" :checkbox="checkbox" :status="colorStatus" />
        <span slot="footer">
          <el-button size="small" @click="dialog=false">取消</el-button>
          <el-button v-show="dialogButtonShow(action.remove.code)" type="danger" size="small" @click="submit(action.remove.code)">{{ action.remove.message }}</el-button>
          <el-button v-show="dialogButtonShow(action.join.code)" type="primary" size="small" @click="submit(action.join.code)">{{ action.join.message }}</el-button>
          <el-button v-show="dialogButtonShow(action.on.code)" type="success" size="small" @click="submit(action.on.code)">{{ action.on.message }}</el-button>
          <el-button v-show="dialogButtonShow(action.off.code)" type="warning" size="small" @click="submit(action.off.code)">{{ action.off.message }}</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="dialog2" :title="sensTitle + '(0-999)'" width="400px">
        <el-form ref="dialog2Form" :model="dialog2Form" label-width="120px" label-position="left">
          <el-form-item label="敏感级别">
            <el-input-number v-model="dialog2Form.sensitiveNum" controls-position="right" :min="0" :max="999" />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button size="small" @click="dialog2=false">取消</el-button>
          <el-button type="primary" size="small" @click="editSensitive()">确认</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="dialog3" :title="apiInfoTitle">
        <apiInfo v-if="api" :api="api" />
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import tree from '../micro-service-tree'
import apiInfo from '../api-info-view'
import { getUrl, getAllService, joinService, delService, onService, offService, sensitiveService, updateService, getServiceDetailsById } from '@/api/ms_api'
export default {
  components: {
    tree,
    apiInfo
  },
  data() {
    return {
      tableData: [],
      loading: true,
      dialog: false,
      filterArr: [],
      checkbox: false,
      dialog2: false,
      sensTitle: '更新接口敏感级别',
      dialog3: false,
      apiInfoTitle: '接口详情信息',
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
          message: '修改'
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
          message: '删除'
        }
      },
      api: undefined,
      dialog2Form: {
        sensitiveNum: 0
      },
      // 批量更新需要记住row
      updateRow: undefined,
      nowActionCode: 0,
      url: undefined
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
  created() {
    this.getList()
  },
  methods: {
    async updateService() {
      if (!this.url) {
        await getUrl().then(response => {
          this.url = response.data
        }).catch(_ => {

        })
      }
      this.$prompt(
        '网关地址',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: this.url
        }
      ).then(({ value }) => {
        updateService(value).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.url = value
        })
      }).catch(() => {

      })
    },
    editAction(row) {
      if (row.children) {
        const sensitiveNum = this.findMaxSens(row)
        this.sensTitle = '更新当前微服务所有接口敏感级别'
        if (row.id === -1) {
          this.sensTitle = '更新所有微服务所有接口敏感级别'
        }
        this.dialog2Form.sensitiveNum = sensitiveNum
      } else {
        this.sensTitle = '更新当前接口敏感级别'
        this.dialog2Form.sensitiveNum = row.sensitiveNum
      }
      this.updateRow = row
      this.dialog2 = true
    },
    editSensitive() {
      const row = this.updateRow
      const num = this.dialog2Form.sensitiveNum
      const ids = []
      if (row.children) {
        this.findAllChildId(row, ids)
      } else {
        ids.push(row.id)
      }
      sensitiveService(num, ids).then(_ => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.getList()
        this.dialog2 = false
      })
        .catch(res => {
          if (res.code === 450) {
            this.getList()
            this.dialog2 = false
          }
        })
    },
    editAllAction() {
      const filter = {
        name: '根节点',
        id: -1,
        children: this.tableData
      }
      this.editAction(filter)
    },
    findMaxSens(row) {
      let sensitiveNum = 0
      row.children.forEach(e => {
        if (e.children) {
          const sens = this.findMaxSens(e)
          if (sens > sensitiveNum) {
            sensitiveNum = sens
          }
        } else {
          if (e.sensitiveNum > sensitiveNum) { sensitiveNum = e.sensitiveNum }
        }
      })
      return sensitiveNum
    },
    findAllChildId(row, ids) {
      row.children.forEach(e => {
        if (e.children) {
          this.findAllChildId(e, ids)
        } else {
          ids.push(e.id)
        }
      })
    },
    commonAllShow(status) {
      if (this.tableData && this.tableData.length) {
        const flag = this.hasItem(
          this.tableData,
          item => {
            return item.status === status
          }
        )
        return flag
      }
      return false
    },
    commonAllAction(status) {
      let filter = {
        name: '根节点',
        id: -1,
        children: this.tableData
      }
      this.checkbox = false
      if (status !== this.action.look.code) {
        let tempStatus
        if (status === this.action.join.code) {
          tempStatus = this.status.join.code
        } else if (status === this.action.on.code) {
          tempStatus = this.status.off.code
        } else if (status === this.action.off.code) {
          tempStatus = this.status.on.code
        } else if (status === this.action.remove.code) {
          tempStatus = this.status.disabled.code
        }
        this.checkbox = true
        filter = this.filterNode(
          filter,
          item => {
            return item.status === tempStatus
          }
        )
      }
      this.filterArr = [filter]
      this.nowActionCode = status
      this.dialog = true
    },
    commonAction(row, status) {
      if (row.children) {
        let filter = row
        this.checkbox = false
        if (status !== this.action.look.code) {
          let tempStatus
          if (status === this.action.join.code) {
            tempStatus = this.status.join.code
          } else if (status === this.action.on.code) {
            tempStatus = this.status.off.code
          } else if (status === this.action.off.code) {
            tempStatus = this.status.on.code
          } else if (status === this.action.remove.code) {
            tempStatus = this.status.disabled.code
          }
          this.checkbox = true
          filter = this.filterNode(
            row,
            item => {
              return item.status === tempStatus
            }
          )
        }
        this.filterArr = [filter]
        this.nowActionCode = status
        this.dialog = true
      } else {
        // 单条数据不展示树结构
        if (status === this.action.join.code) {
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
                row.status = this.status.on.code
              })
                .catch(res => {
                  if (res.code === 450) { this.getList() }
                })
            })
            .catch(action => {
            })
        } else if (status === this.action.off.code) {
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
                row.status = this.status.off.code
              })
                .catch(res => {
                  if (res.code === 450) { this.getList() }
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
              onService([row.id]).then(_ => {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                row.status = this.status.on.code
              })
                .catch(res => {
                  if (res.code === 450) { this.getList() }
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
              delService([row.id]).then(_ => {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                this.getList()
              })
                .catch(res => {
                  if (res.code === 450) { this.getList() }
                })
            })
            .catch(_ => {})
        }
      }
    },
    submit(status) {
      const ids = this.$refs.tree.getIds()
      if (ids && ids.length) {
        const dataNodes = []
        this.findItems(
          this.tableData,
          item => {
            return ids.indexOf(item.id) !== -1
          },
          dataNodes
        )
        if (status === this.action.join.code) {
          joinService(ids).then(_ => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            dataNodes.forEach(e => {
              e.status = this.status.on.code
            })
            this.dialog = false
          })
            .catch(res => {
              if (res.code === 450) {
                this.getList()
                this.dialog = false
              }
            })
        } else if (status === this.action.on.code) {
          onService(ids).then(_ => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            dataNodes.forEach(e => {
              e.status = this.status.on.code
            })
            this.dialog = false
          })
            .catch(res => {
              if (res.code === 450) {
                this.getList()
                this.dialog = false
              }
            })
        } else if (status === this.action.off.code) {
          offService(ids).then(_ => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            dataNodes.forEach(e => {
              e.status = this.status.off.code
            })
            this.dialog = false
          })
            .catch(res => {
              if (res.code === 450) {
                this.getList()
                this.dialog = false
              }
            })
        } else if (status === this.action.remove.code) {
          delService(ids).then(_ => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.getList()
            this.dialog = false
          })
            .catch(res => {
              if (res.code === 450) {
                this.getList()
                this.dialog = false
              }
            })
        }
      } else {
        this.$alert('不能为空！')
      }
    },
    filterNode(node, fn) {
      if (node.children) {
        const nodeChildren = []
        node.children.forEach(item => {
          const tempNode = this.filterNode(item, fn)
          if (tempNode) {
            nodeChildren.push(tempNode)
          }
        })
        if (nodeChildren && nodeChildren.length) {
          const tempNodeFa = Object.assign({}, node)
          tempNodeFa.children = nodeChildren
          return tempNodeFa
        }
      } else {
        if (fn(node)) {
          return Object.assign({}, node)
        }
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
          } else {
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
    dialogButtonShow(status) {
      return status === this.nowActionCode
    },
    commonShow(row, status) {
      if (row.children) {
        const flag = row.children.some(item => {
          return item.status === status
        })
        return flag
      } else {
        return row.status === status
      }
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
    tag_type(row) {
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
    async info(row) {
      if (row.type && !row.apiDetails) {
        await getServiceDetailsById(row.id).then(response => {
          this.$set(row, 'apiDetails', response.data)
        })
      }
      this.apiInfoTitle = '接口详情信息'
      if (!row.type) {
        this.apiInfoTitle = '微服务详情信息'
      }
      this.api = row
      this.dialog3 = true
    },
    async getList() {
      this.loading = true
      await getAllService().then(response => {
        this.tableData = response.data
      }).catch(_ => {
      })
      this.loading = false
    }
  }
}
</script>
<style>
.el-header {
  line-height: 60px;
}
.el-main {
  padding: 0 20px;
}
</style>
