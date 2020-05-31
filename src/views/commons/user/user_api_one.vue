<template>
  <div class="app-container">
    <el-table
      v-loading="loading"
      :data="tableData"
      element-loading-text="加载中..."
      row-key="id"
      :indent="0"
      border
      highlight-current-row
      :row-class-name="tableRowClassName"
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
      <el-table-column prop="applyTime" label="申请时间" align="center" min-width="200" />
      <el-table-column prop="expireTime" label="到期时间" align="center" min-width="200" />
      <el-table-column
        prop="status"
        label="用户接口关系状态"
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
            <span v-if="textShow(scope.row)">
              <el-tooltip class="item" effect="dark" :content="text(scope.row)" placement="right">
                <el-tag
                  type="danger"
                  effect="dark"
                >{{ status.disabled.message }}</el-tag>
              </el-tooltip>
            </span>
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="暂失效原因" align="center" min-width="150">
        <template slot-scope="scope">
          <span v-if="textShow(scope.row)">{{text(scope.row)}}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column fixed="right" label="操作" align="center" width="77">
        <template slot-scope="scope">
          <el-row>
            <el-button
              v-if="scope.row.children"
              type="primary"
              size="small"
              @click="commonAction(scope.row, action.look.code)"
            >{{ action.look.message }}</el-button>
          </el-row>
        </template>
      </el-table-column> -->
    </el-table>
    <el-dialog ref="dialog" :visible.sync="dialog" :center="true" width="500px">
      <tree ref="tree" :tree-data="filterArr" :checkbox="checkbox" :status="colorStatus" />
      <span slot="footer">
        <el-button size="small" @click="dialog=false">取消</el-button>
        <el-button v-show="dialogButtonShow(action.remove.code)" type="danger" size="small" @click="submit(action.remove.code)">{{ action.remove.message }}</el-button>
        <el-button v-show="dialogButtonShow(action.on.code)" type="success" size="small" @click="submit(action.on.code)">{{ action.on.message }}</el-button>
        <el-button v-show="dialogButtonShow(action.off.code)" type="warning" size="small" @click="submit(action.off.code)">{{ action.off.message }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialog2" :title="sensTitle" width="400px">
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
  </div>
</template>
<script>
import tree from '../micro-service-tree'
import apiInfo from '../api-info-view'
import { getAllService, joinService, delService, onService, offService, sensitiveService, updateService, getServiceDetailsById } from '@/api/ms_api'
import { getUser, getUserBy } from '@/api/ms_user'
import { getUserApi, getUserApiByUser, onUserApi, offUserApi, delUserApi } from '@/api/ms_user_api'
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
          code: 3,
          message: '查看'
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
      user: {},
      userApis: [],
      apiIds: []
    }
  },
  inject: ['reload'],
  computed: {
    colorStatus() {
      return {
        gray: this.status.expire,
        orange: this.status.off,
        green: this.status.on
      }
    }
    // ,
    // apiIds() {
    //   return this.userApis.map(item => item.apiId)
    // }
  },
  created() {
    this.getList()
  },
  methods: {
    updateService() {

    },
    textShow(row) {
      if (row.children || row.apiStatus === 2 && row.sensitiveNum <= row.userSensitiveNum || row.status === this.status.expire.code || row.status === this.status.off.code) {
        return false
      }
      return true
    },
    text(row) {
      if (row.apiStatus === 1) {
        return '接口已停用'
      } else if (row.apiStatus === 0) {
        return '接口待接入'
      } else if (row.apiStatus === -1) {
        return '接口未生效'
      } else if (row.sensitiveNum > row.userSensitiveNum) {
        return '用户敏感级别不足'
      }
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
        if (status === this.action.on.code) {
          tempStatus = this.status.off.code
        } else if (status === this.action.off.code) {
          tempStatus = this.status.on.code
        } else if (status === this.action.remove.code) {
          tempStatus = this.status.expire.code
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
          if (status === this.action.on.code) {
            tempStatus = this.status.off.code
          } else if (status === this.action.off.code) {
            tempStatus = this.status.on.code
          } else if (status === this.action.remove.code) {
            tempStatus = this.status.expire.code
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
        if (status === this.action.off.code) {
          this.$confirm('确认' + this.action.off.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(_ => {
              offUserApi([{ userId: row.userId, apiId: row.id }]).then(_ => {
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
              onUserApi([{ userId: row.userId, apiId: row.id }]).then(_ => {
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
              delUserApi([{ userId: row.userId, apiId: row.id }]).then(_ => {
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
        const userApiIds = dataNodes.map(row => {
          return { userId: row.userId, apiId: row.id }
        })
        if (status === this.action.on.code) {
          onUserApi(userApiIds).then(_ => {
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
          offUserApi(userApiIds).then(_ => {
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
          delUserApi(userApiIds).then(_ => {
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
    buildNode(node) {
      if (node.children) {
        const nodeChildren = []
        node.children.forEach(item => {
          const tempNode = this.buildNode(item)
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
        if (this.apiIds.indexOf(node.id) !== -1) {
          console.log('test', node)
          const temp = Object.assign({}, node)
          const status = temp.status
          for (const v of this.userAPis) {
            if (v.apiId === temp.id) {
              temp.status = v.status
              this.$set(temp, 'applyTime', v.applyTime)
              this.$set(temp, 'expireTime', v.expireTime)
              this.$set(temp, 'apiStatus', status)
              this.$set(temp, 'userId', this.user.id)
              this.$set(temp, 'userSensitiveNum', this.user.sensitiveNum)
              break
            }
          }
          return temp
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
        let b = 0
        let c = 0
        let d = 0
        arr.forEach(element => {
          if (element.status === this.status.on.code) {
            b++
          } else if (element.status === this.status.off.code) {
            c++
          } else if (element.status === this.status.expire.code) {
            d++
          }
        })
        return this.status.on.message + b + '、' +
                this.status.off.message + c + '、' +
                this.status.expire.message + d
      } else {
        if (row.status === this.status.on.code) {
          return this.status.on.message
        } else if (row.status === this.status.off.code) {
          return this.status.off.message
        } else if (row.status === this.status.expire.code) {
          return this.status.expire.message
        }
      }
    },
    tag_type(row) {
      if (row.status === this.status.on.code) {
        return 'success'
      } else if (row.status === this.status.off.code) {
        return 'warning'
      } else if (row.status === this.status.expire.code) {
        return 'info'
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.children || row.apiStatus === 2 && row.sensitiveNum <= row.userSensitiveNum) {
        return ''
      }
      return 'expire-row'
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
      await getUserBy().then(async response => {
        const user = response.data
        if (user) {
          this.user = user
          await getUserApiByUser().then(async response => {
            const userApis = response.data
            if (userApis && userApis.length) {
              this.userAPis = userApis
              this.apiIds = userApis.map(item => item.apiId)
              await getAllService().then(response => {
                const tempData = response.data
                this.tableData = tempData.map(item => this.buildNode(item)).filter(item => item)
                console.log('查询结束')
              }).catch(_ => {
                console.log('查询接口信息出现异常')
              })
            } else {
              this.tableData = []
            }
          }).catch(_ => {

          })
        } else {
          this.tableData = []
        }
      }).catch(_ => {
        console.log('获取用户信息异常')
      })
      console.log('loading结束')
      this.loading = false
      // getAllService().then(response => {
      //   this.tableData = response.data
      //   this.loading = false
      // }).catch(_ => {
      //   this.loading = false
      // })
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
.el-table .expire-row {
  background: rgb(233, 233, 235);
}
</style>
