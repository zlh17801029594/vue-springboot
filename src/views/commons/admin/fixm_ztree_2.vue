<template>
  <div class="app-container">
    <el-container>
      <el-header align="left" style="height: 40px; line-height: 36px; padding: 0; padding-bottom: 4px">
        <el-col :span="12">
          <el-input id="key" v-model="key" placeholder="请输入关键字" prefix-icon="el-icon-search" />
        </el-col>
        <el-col :span="12" style="padding: 0 20px">
          <el-button type="primary" size="small" :disabled="!isUpdateNode || editShow" @click="handleUpdateNode">更新</el-button>
          <el-button type="primary" size="small" :disabled="!isAddNode || addShow" @click="handleAddNode">添加子节点</el-button>
          <!-- <el-button type="primary" size="small" @click="handleAddRootNode">添加根节点</el-button> -->
          <el-button type="primary" size="small" :disabled="!isDeleteNode" @click="handleDeleteNode">删除</el-button>
        </el-col>
      </el-header>
      <el-container style="height: calc(100vh - 164px); padding: 0">
        <el-aside style="width: 50%; padding: 0; margin: 0; background: #FFF;">
          <el-card style="min-height: 100%">
            <ul id="ztree" class="ztree" />
          </el-card>
        </el-aside>
        <el-main style="padding: 0 0 0 20px">
          <el-card style="min-height: 100%">
            <el-form v-show="isShow" ref="form" :rules="rules" :model="form" label-position="left" label-width="100px">
              <el-form-item v-show="addShow" label="父节点" prop="parentName">
                <el-col :span="12">
                  <el-input v-model="form.parentName" :disabled="true" />
                </el-col>
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-col :span="12">
                  <el-input v-show="inputShow" v-model="form.name" />
                  <span v-show="!inputShow">{{ form.name }}</span>
                </el-col>
              </el-form-item>
              <el-form-item v-show="leafShow" label="数据源字段" prop="srcColumn">
                <el-col :span="12">
                  <el-input v-show="inputShow" v-model="form.srcColumn" />
                  <span v-show="!inputShow">{{ form.srcColumn }}</span>
                </el-col>
              </el-form-item>
              <el-form-item v-if="leafShow" label="节点/属性" prop="isnode">
                <el-col :span="12">
                  <el-select v-show="inputShow" v-model="form.isnode" style="width: 100%" :disabled="editShow" placeholder="请选择类型">
                    <el-option label="节点" :value="true" />
                    <el-option label="属性" :value="false" />
                  </el-select>
                  <span v-show="!inputShow">{{ form.isnode ? '节点' : '属性' }}</span>
                </el-col>
              </el-form-item>
              <el-form-item v-show="leafShow" label="字段解释" prop="explain">
                <el-col :span="12">
                  <el-input v-show="inputShow" v-model="form.explain" />
                  <span v-show="!inputShow">{{ form.explain }}</span>
                </el-col>
              </el-form-item>
              <el-form-item v-show="leafShow" label="测试值" prop="testvalue">
                <el-col :span="12">
                  <el-input v-show="inputShow" v-model="form.testvalue" />
                  <span v-show="!inputShow">{{ form.testvalue }}</span>
                </el-col>
              </el-form-item>
              <el-form-item v-show="leafShow" label="扩展文件名" prop="fileextension">
                <el-col :span="12">
                  <el-input v-show="inputShow" v-model="form.fileextension" />
                  <span v-show="!inputShow">{{ form.fileextension }}</span>
                </el-col>
              </el-form-item>
              <el-form-item v-show="leafShow" label="转换方法" prop="convextension">
                <el-col :span="12">
                  <el-input v-show="inputShow" v-model="form.convextension" />
                  <span v-show="!inputShow">{{ form.convextension }}</span>
                </el-col>
              </el-form-item>
              <el-form-item v-show="leafShow" label="是否生效" prop="isvalid">
                <el-switch v-show="inputShow" v-model="form.isvalid" />
                <span v-show="!inputShow">{{ form.isvalid ? '是' : '否' }}</span>
              </el-form-item>
              <el-form-item>
                <el-button v-if="addShow || editShow" @click="info">取消</el-button>
                <el-button v-if="addShow" type="primary" @click="addNode">添加</el-button>
                <el-button v-if="editShow" type="primary" @click="updateNode">更新</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getFixm, addFixm, updateFixm, updateFixmName, drawFixm, delFixm } from '@/api/fixm'
const version = 'core4.2'
const split_sign = '->'
export default {
  data() {
    var validName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('名称不能为空'))
      } else {
        if (this.addShow || this.editShow) {
          let treeNode
          if (this.addShow) {
            treeNode = this.treeNode
          } else if (this.editShow) {
            treeNode = this.treeNode.getParentNode()
            const name = this.treeNode.name
            if (name === value) {
              callback()
            }
          }
          if (this.isSameName(treeNode, value)) {
            callback(new Error('同级节点不能同名'))
          }
        }
        callback()
      }
    }
    return {
      treeData: [],
      key: undefined,
      form: {
        parentName: undefined,
        name: undefined,
        srcColumn: undefined,
        isnode: undefined,
        explain: undefined,
        testvalue: undefined,
        fileextension: undefined,
        convextension: undefined,
        isvalid: true
      },
      treeNode: null,
      isShow: false,
      isAddNode: false,
      isUpdateNode: false,
      isDeleteNode: false,
      leafShow: false,
      addShow: false,
      editShow: false,
      rules: {
        name: [
          // { required: true, message: '名称不能为空', trigger: 'blur' },
          { validator: validName, required: true, trigger: ['blur', 'change'] }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        isnode: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    inputShow() {
      return this.addShow || this.editShow
    }
  },
  watch: {
    treeNode(treeNode) {
      this.info()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 增加多层级子节点时注意 isnode应该为true(第一层级)
    addChildIndex(treeNode, isnode) {
      let items
      if (treeNode) {
        items = treeNode.children
      } else {
        const zTree = $.fn.zTree.getZTreeObj('ztree')
        items = zTree.getNodes()
      }
      if (items) {
        if (isnode) {
          let index = 0
          items.forEach(item => {
            const isnode = item.isnode
            if (typeof isnode === 'undefined' || isnode) {
              index = item.getIndex()
            }
          })
          return index + 1
        }
        return items.length
      }
      return 0
    },
    // 查找子节点名称数组(验证是否同级同名)
    findChildName(treeNode) {
      let items
      if (treeNode) {
        items = treeNode.children
      } else {
        const zTree = $.fn.zTree.getZTreeObj('ztree')
        items = zTree.getNodes()
      }
      if (items) {
        return items.map(item => item.name)
      }
      return []
    },
    isSameName(treeNode, newName) {
      const childName = this.findChildName(treeNode)
      if (childName.length && childName.indexOf(newName) !== -1) {
        return true
      }
      return false
    },
    // 查找子节点不同类型名称数组(更新排序序列需要)
    findOrderChildName(treeNode) {
      let items
      if (treeNode) {
        items = treeNode.children
      } else {
        const zTree = $.fn.zTree.getZTreeObj('ztree')
        items = zTree.getNodes()
      }
      const nodeOrderChildName = []
      const propertyOrderChildName = []
      if (items) {
        items.forEach(item => {
          const isnode = item.isnode
          if (typeof isnode === 'undefined' || isnode) {
            nodeOrderChildName.push(item.name)
          } else {
            propertyOrderChildName.push(item.name)
          }
        })
      }
      return [nodeOrderChildName, propertyOrderChildName]
    },
    // 构建子节点排序序列(这是更新后的序列，好像没用处)
    convertOrder(orderChildName) {
      if (orderChildName && orderChildName.length) {
        let order = ''
        orderChildName.forEach(item => {
          order = order.concat(split_sign).concat(item)
        })
        if (order.indexOf(split_sign) !== -1) {
          order = order.substring(split_sign.length)
        }
        return order
      }
      return ''
    },
    // 生成xsdnode值
    buildXsdnode(treeNode) {
      if (treeNode) {
        const nodes = treeNode.getPath()
        let xsdnode = ''
        nodes.forEach(item => {
          xsdnode = xsdnode.concat(split_sign).concat(item.name)
        })
        xsdnode = xsdnode.substring(split_sign.length)
        return xsdnode
      } else {
        return ''
      }
    },
    // 根据xsdnode值获取父节点xsdnode值
    buildFatherXsdnode(xsdnode) {
      let fatherXsdnode = ''
      if (xsdnode.indexOf(split_sign) !== -1) {
        fatherXsdnode = xsdnode.substring(0, xsdnode.lastIndexOf(split_sign))
      }
      return fatherXsdnode
    },
    // 转换多层级节点
    buildNode(nodes, fixmLogic) {
      const parent = nodes.shift()
      if (nodes && nodes.length > 0) {
        const child = this.buildNode(nodes, fixmLogic)
        return {
          name: parent,
          isnode: true,
          children: [child]
        }
      } else {
        return fixmLogic
      }
    },
    // 判断是否需要保留空父节点提示
    saveFather(treeNode) {
      const fathNode = treeNode.getParentNode()
      const childName = this.findChildName(fathNode)
      if (childName && childName.length === 1) {
        if (!fathNode) {
          return false
        } else {
          return true
        }
      }
      return false
    },
    blankFather(treeNode) {
      const fathNode = treeNode.getParentNode()
      const childName = this.findChildName(fathNode)
      if (childName && childName.length === 1) {
        // 空目录
        if (!fathNode) {
          return treeNode
        } else {
          return this.blankFather(fathNode)
        }
      } else {
        return treeNode
      }
    },
    getList() {
      getFixm(version).then(response => {
        this.treeData = response.data
        this.initTree()
      })
    },
    info() {
      const treeNode = this.treeNode
      if (treeNode) {
        this.commonShow()
      } else {
        this.isAddNode = false
        this.isUpdateNode = false
        this.isDeleteNode = false
        this.isShow = false
      }
    },
    commonShow() {
      const treeNode = this.treeNode
      const isAddNode = treeNode.isParent || treeNode.isnode
      this.isAddNode = isAddNode
      this.isUpdateNode = true
      this.isDeleteNode = true
      this.isShow = true
      this.leafShow = !treeNode.isParent
      this.resetShow()
      this.form = Object.assign({}, treeNode)
    },
    resetShow() {
      // 重置表单（值和校验规则）
      // this.$refs['form'].resetFields()
      this.resetForm()
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
      // 重置展示项
      this.addShow = false
      this.editShow = false
    },
    resetForm() {
      this.form = {
        parentName: undefined,
        name: undefined,
        srcColumn: undefined,
        isnode: undefined,
        explain: undefined,
        testvalue: undefined,
        fileextension: undefined,
        convextension: undefined,
        isvalid: true
      }
    },
    handleAddNode() {
      this.resetShow()
      const parentName = this.treeNode.name
      this.form.parentName = parentName
      // 显示表单添加按钮
      this.addShow = true
      // 添加逻辑为直接添加叶子节点
      this.leafShow = true
    },
    addNode() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.form)
          const zTree = $.fn.zTree.getZTreeObj('ztree')
          const treeNode = this.treeNode
          // fatherXsdnode
          const fatherXsdnode = this.buildXsdnode(treeNode)
          // 构建order序列
          let name = tempData.name
          let isnode = tempData.isnode
          // 增加多层级节点
          if (name.indexOf(split_sign) !== -1) {
            name = name.substring(0, name.indexOf(split_sign))
            isnode = true
          }
          const orderChildName = this.findOrderChildName(treeNode)
          const nodeOrderChildName = orderChildName[0]
          const propertyOrderChildName = orderChildName[1]
          if (typeof isnode === 'undefined' || isnode) {
            // 添加
            nodeOrderChildName.push(name)
          } else {
            // 添加
            propertyOrderChildName.push(name)
          }
          const nodeOrder = this.convertOrder(nodeOrderChildName)
          const propertyOrder = this.convertOrder(propertyOrderChildName)
          const fixmLogic = {
            fatherXsdnode: fatherXsdnode,
            name: tempData.name,
            srcColumn: tempData.srcColumn ? tempData.srcColumn : undefined,
            isnode: tempData.isnode,
            explain: tempData.explain ? tempData.explain : undefined,
            testvalue: tempData.testvalue ? tempData.testvalue : undefined,
            fileextension: tempData.fileextension ? tempData.fileextension : undefined,
            convextension: tempData.convextension ? tempData.convextension : undefined,
            isvalid: tempData.isvalid,
            nodeOrder: nodeOrder,
            propertyOrder: propertyOrder
          }
          this.$confirm('确认添加', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(_ => {
            addFixm(version, fixmLogic).then(response => {
              const fixmData = response.data
              console.log('fixmData', fixmData)
              const nodes = tempData.name.split('->')
              const node = this.buildNode(nodes, fixmData)
              // 添加节点位置
              const index = this.addChildIndex(treeNode, isnode)
              zTree.addNodes(treeNode, index, node)
              // 刷新树节点
              zTree.refresh()
              this.$message({
                type: 'success',
                message: '操作成功'
              })
            }).catch(res => {
              if (res.code === 450) {
                this.getList()
              }
            })
          }).catch(_ => {
          })
        }
      })
    },
    handleAddRootNode() {},
    handleUpdateNode() {
      this.commonShow()
      // 显示表单更新按钮
      this.editShow = true
    },
    updateNode() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.form)
          const zTree = $.fn.zTree.getZTreeObj('ztree')
          const treeNode = this.treeNode
          // xsdnode
          const xsdnode = this.buildXsdnode(treeNode)
          // 构建order序列
          const name = treeNode.name
          const isnode = treeNode.isnode
          let nodeOrder, propertyOrder
          if (tempData.name !== name) {
            const fathNode = treeNode.getParentNode()
            const orderChildName = this.findOrderChildName(fathNode)
            const nodeOrderChildName = orderChildName[0]
            const propertyOrderChildName = orderChildName[1]
            if (typeof isnode === 'undefined' || isnode) {
              const index = nodeOrderChildName.indexOf(name)
              // 修改
              nodeOrderChildName.splice(index, 1, tempData.name)
            } else {
              const index = propertyOrderChildName.indexOf(name)
              // 修改
              propertyOrderChildName.splice(index, 1, tempData.name)
            }
            nodeOrder = this.convertOrder(nodeOrderChildName)
            propertyOrder = this.convertOrder(propertyOrderChildName)
          }
          const fixmLogic = {}
          if (treeNode.isParent) {
            fixmLogic.xsdnode = xsdnode
            fixmLogic.newName = tempData.name
            fixmLogic.nodeOrder = nodeOrder
            fixmLogic.propertyOrder = propertyOrder
            this.$confirm('确认更新', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(_ => {
              updateFixmName(version, fixmLogic).then(_ => {
                treeNode.name = tempData.name
                zTree.updateNode(treeNode)
                // 刷新树节点
                zTree.refresh()
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
              }).catch(res => {
                if (res.code === 450) {
                  this.getList()
                }
              })
            }).catch(_ => {
            })
          } else {
            fixmLogic.xsdnode = xsdnode
            fixmLogic.newName = tempData.name
            fixmLogic.isnode = tempData.isnode
            fixmLogic.srcColumn = tempData.srcColumn
            fixmLogic.explain = tempData.explain
            fixmLogic.testvalue = tempData.testvalue
            fixmLogic.fileextension = tempData.fileextension
            fixmLogic.convextension = tempData.convextension
            fixmLogic.isvalid = tempData.isvalid
            fixmLogic.nodeOrder = nodeOrder
            fixmLogic.propertyOrder = propertyOrder
            this.$confirm('确认更新', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(_ => {
              updateFixm(version, fixmLogic).then(_ => {
                treeNode.name = tempData.name
                treeNode.srcColumn = tempData.srcColumn
                treeNode.explain = tempData.explain
                treeNode.testvalue = tempData.testvalue
                treeNode.fileextension = tempData.fileextension
                treeNode.convextension = tempData.convextension
                treeNode.isvalid = tempData.isvalid
                zTree.updateNode(treeNode)
                // 刷新树节点
                zTree.refresh()
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
              }).catch(res => {
                if (res.code === 450) {
                  this.getList()
                }
              })
            }).catch(_ => {
            })
          }
        }
      })
    },
    // targetNode可能为null(根节点)
    handleDragFixm(treeId, treeNodes, targetNode, moveType) {
      const zTree = $.fn.zTree.getZTreeObj('ztree')
      console.log(treeNodes, targetNode, moveType)
      const sourceNode = treeNodes[0]
      const fathNode = sourceNode.getParentNode()
      const name = sourceNode.name
      const isnode = sourceNode.isnode
      const xsdnode = this.buildXsdnode(sourceNode)
      // 构建相关排序数据参数 1.父类，2.新父类，3.是否保留空目录。
      let newFatherXsdnode, nodeOrder, propertyOrder, newNodeOrder, newPropertyOrder
      // 构建order序列
      const orderChildName = this.findOrderChildName(fathNode)
      const nodeOrderChildName = orderChildName[0]
      const propertyOrderChildName = orderChildName[1]
      if (typeof isnode === 'undefined' || isnode) {
        const index = nodeOrderChildName.indexOf(name)
        // 删除
        nodeOrderChildName.splice(index, 1)
      } else {
        const index = propertyOrderChildName.indexOf(name)
        // 删除
        propertyOrderChildName.splice(index, 1)
      }
      nodeOrder = this.convertOrder(nodeOrderChildName)
      propertyOrder = this.convertOrder(propertyOrderChildName)
      if (moveType === 'inner') {
        newFatherXsdnode = this.buildXsdnode(targetNode)
        // 构建new order序列
        // node/property类型的最后一个位置
        const orderChildName = this.findOrderChildName(targetNode)
        const nodeOrderChildName = orderChildName[0]
        const propertyOrderChildName = orderChildName[1]
        if (typeof isnode === 'undefined' || isnode) {
          // 转换inner 为 prev
          if (nodeOrderChildName.length) {
            targetNode = targetNode ? targetNode.children[nodeOrderChildName.length - 1] : zTree.getNodes()[nodeOrderChildName.length - 1]
            moveType = 'next'
          } else if (propertyOrderChildName.length) {
            targetNode = targetNode ? targetNode.children[nodeOrderChildName.length] : zTree.getNodes()[nodeOrderChildName.length]
            moveType = 'prev'
            console.log(targetNode, moveType)
          }
          // 添加
          nodeOrderChildName.push(name)
        } else {
          // 转换inner 为 next
          if (nodeOrderChildName.length || propertyOrderChildName.length) {
            targetNode = targetNode ? targetNode.children[nodeOrderChildName.length + propertyOrderChildName.length - 1] : zTree.getNodes()[nodeOrderChildName.length + propertyOrderChildName.length - 1]
            moveType = 'next'
          }
          // 添加
          propertyOrderChildName.push(name)
        }
        newNodeOrder = this.convertOrder(nodeOrderChildName)
        newPropertyOrder = this.convertOrder(propertyOrderChildName)
      } else {
        const newFatherNode = targetNode.getParentNode()
        // 同级校验可以放prev、inner、next中
        this.isSameName(newFatherNode, xsdnode)
        newFatherXsdnode = this.buildXsdnode(newFatherNode)
        const fatherXsdnode = this.buildFatherXsdnode(xsdnode)
        if (fatherXsdnode === newFatherXsdnode) {
          // 同级拖拽
          // 前端传递 null
          // newFatherXsdnode = null
          // 前端不传递该参数
          newFatherXsdnode = undefined
          const targetName = targetNode.name
          // 构建order序列
          const orderChildName = this.findOrderChildName(fathNode)
          const nodeOrderChildName = orderChildName[0]
          const propertyOrderChildName = orderChildName[1]
          let tempArr
          if (typeof isnode === 'undefined' || isnode) {
            tempArr = nodeOrderChildName
          } else {
            tempArr = propertyOrderChildName
          }
          // 移动位置
          // 1.查找节点位置
          let index = tempArr.indexOf(name)
          // 2.移除节点
          tempArr.splice(index, 1)
          // 3.添加到合适位置
          index = tempArr.indexOf(targetName)
          if (moveType === 'prev') {
            // 相关节点index
            tempArr.splice(index, 0, name)
          } else if (moveType === 'next') {
            // 相关节点index + 1
            tempArr.splice(index + 1, 0, name)
          }
          nodeOrder = this.convertOrder(nodeOrderChildName)
          propertyOrder = this.convertOrder(propertyOrderChildName)
        } else {
          // 跨级拖拽
          const targetName = targetNode.name
          // 构建new order序列
          const orderChildName = this.findOrderChildName(newFatherNode)
          const nodeOrderChildName = orderChildName[0]
          const propertyOrderChildName = orderChildName[1]
          let tempArr
          if (typeof isnode === 'undefined' || isnode) {
            tempArr = nodeOrderChildName
          } else {
            tempArr = propertyOrderChildName
          }
          // 3.添加到合适位置
          const index = tempArr.indexOf(targetName)
          if (moveType === 'prev') {
            // 相关节点index
            tempArr.splice(index, 0, name)
          } else if (moveType === 'next') {
            // 相关节点index + 1
            tempArr.splice(index + 1, 0, name)
          }
          newNodeOrder = this.convertOrder(nodeOrderChildName)
          newPropertyOrder = this.convertOrder(propertyOrderChildName)
        }
      }
      this.$confirm('确认拖拽到此处', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(_ => {
        drawFixm(version, {
          xsdnode: xsdnode,
          newFatherXsdnode: newFatherXsdnode,
          nodeOrder: nodeOrder,
          propertyOrder: propertyOrder,
          newNodeOrder: newNodeOrder,
          newPropertyOrder: newPropertyOrder
        }).then(response => {
          zTree.moveNode(targetNode, treeNodes[0], moveType)
          // 刷新树节点
          // zTree.refresh()
          console.log(fathNode)
          // setTimeout(() => {
          //   zTree.refresh()
          // }, 100)
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        }).catch(res => {
          if (res.code === 450) {
            this.getList()
          }
        })
      }).catch(_ => {
      })
    },
    async handleDeleteNode() {
      await this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async _ => {
        const zTree = $.fn.zTree.getZTreeObj('ztree')
        let treeNode = this.treeNode
        // 提交后台数据
        const fixmLogic = {}
        const saveFather = this.saveFather(treeNode)
        if (saveFather) {
          await this.$confirm('是否保留空目录', '提示', {
            confirmButtonText: '保留',
            cancelButtonText: '删除',
            type: 'info'
          }).then(_ => {
            // 保留空目录，返回值重要
            // fixmLogic.saveFather = true
          }).catch(_ => {
            // 删除空目录，删除节点更改
            treeNode = this.blankFather(treeNode.getParentNode())
          })
          console.log('is save')
        }
        // xsdnode
        const xsdnode = this.buildXsdnode(treeNode)
        // 构建order序列
        const name = treeNode.name
        const isnode = treeNode.isnode
        const fathNode = treeNode.getParentNode()
        const orderChildName = this.findOrderChildName(fathNode)
        const nodeOrderChildName = orderChildName[0]
        const propertyOrderChildName = orderChildName[1]
        if (typeof isnode === 'undefined' || isnode) {
          const index = nodeOrderChildName.indexOf(name)
          // 删除
          nodeOrderChildName.splice(index, 1)
        } else {
          const index = propertyOrderChildName.indexOf(name)
          // 删除
          propertyOrderChildName.splice(index, 1)
        }
        const nodeOrder = this.convertOrder(nodeOrderChildName)
        const propertyOrder = this.convertOrder(propertyOrderChildName)
        const fixmLogicTemp = {
          xsdnode: xsdnode,
          nodeOrder: nodeOrder,
          propertyOrder: propertyOrder,
          saveFather: saveFather
        }
        Object.assign(fixmLogic, fixmLogicTemp)
        delFixm(version, fixmLogic).then(_ => {
          zTree.removeNode(treeNode, false)
          // 刷新树节点
          zTree.refresh()
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        }).catch(res => {
          if (res.code === 450) {
            this.getList()
          }
        })
      }).catch(_ => {
        // 取消操作
      })
      console.log('is delete')
    },
    async handleDeleteNode_bak() {
      const zTree = $.fn.zTree.getZTreeObj('ztree')
      const treeNode = this.treeNode
      // xsdnode
      const xsdnode = this.buildXsdnode(treeNode)
      // 构建order序列
      const name = treeNode.name
      const isnode = treeNode.isnode
      const fathNode = treeNode.getParentNode()
      const orderChildName = this.findOrderChildName(fathNode)
      const nodeOrderChildName = orderChildName[0]
      const propertyOrderChildName = orderChildName[1]
      if (typeof isnode === 'undefined' || isnode) {
        const index = nodeOrderChildName.indexOf(name)
        // 删除
        nodeOrderChildName.splice(index, 1)
      } else {
        const index = propertyOrderChildName.indexOf(name)
        // 删除
        propertyOrderChildName.splice(index, 1)
      }
      const nodeOrder = this.convertOrder(nodeOrderChildName)
      const propertyOrder = this.convertOrder(propertyOrderChildName)
      const fixmLogic = {
        xsdnode: xsdnode,
        nodeOrder: nodeOrder,
        propertyOrder: propertyOrder
      }
      const saveFather = this.saveFather(treeNode)
      await this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async _ => {
        if (saveFather) {
          await this.$confirm('是否保留空目录', '提示', {
            confirmButtonText: '保留',
            cancelButtonText: '删除',
            type: 'info'
          }).then(_ => {
            // 保留空目录，返回值重要
            fixmLogic.saveFather = true
            delFixm(version, fixmLogic).then(_ => {
              zTree.removeNode(treeNode, false)
              // 刷新树节点
              zTree.refresh()
              // console.log(fatshNode)
              this.$message({
                type: 'success',
                message: '操作成功'
              })
            }).catch(res => {
              if (res.code === 450) {
                this.getList()
              }
            })
          }).catch(_ => {
            // 删除空目录，删除节点更改
            const treeNode = this.blankFather(fathNode)
            // xsdnode
            const xsdnode = this.buildXsdnode(treeNode)
            // 构建order序列
            const name = treeNode.name
            const isnode = treeNode.isnode
            // const fatheNode会导致之前fathNode异常
            const fathNode1 = treeNode.getParentNode()
            const orderChildName = this.findOrderChildName(fathNode1)
            const nodeOrderChildName = orderChildName[0]
            const propertyOrderChildName = orderChildName[1]
            if (typeof isnode === 'undefined' || isnode) {
              const index = nodeOrderChildName.indexOf(name)
              // 删除
              nodeOrderChildName.splice(index, 1)
            } else {
              const index = propertyOrderChildName.indexOf(name)
              // 删除
              propertyOrderChildName.splice(index, 1)
            }
            const nodeOrder = this.convertOrder(nodeOrderChildName)
            const propertyOrder = this.convertOrder(propertyOrderChildName)
            const fixmLogic = {
              xsdnode: xsdnode,
              nodeOrder: nodeOrder,
              propertyOrder: propertyOrder
            }
            // delFixm(version, fixmLogic).then(_ => {
            //   zTree.removeNode(treeNode, false)
            //   // 刷新树节点
            //   zTree.refresh()
            //   this.$message({
            //     type: 'success',
            //     message: '操作成功'
            //   })
            // }).catch(res => {
            //   if (res.code === 450) {
            //     this.getList()
            //   }
            // })
          })
          console.log('is save')
        } else {
          delFixm(version, fixmLogic).then(_ => {
            zTree.removeNode(treeNode, false)
            // 刷新树节点
            zTree.refresh()
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          }).catch(res => {
            if (res.code === 450) {
              this.getList()
            }
          })
        }
      }).catch(_ => {
      })
      console.log('is delete')
    },
    beforeDrop(treeId, treeNodes, targetNode, moveType) {
      this.handleDragFixm(treeId, treeNodes, targetNode, moveType)
      return false
    },
    onDrop(event, treeId, treeNodes, targetNode, moveType) {
      console.log(treeNodes, targetNode, moveType)
      if (!moveType) {
        console.log('未拖拽')
      } else {
        // 刷新树节点
        // const zTree = $.fn.zTree.getZTreeObj('ztree')
        // zTree.refresh()
      }
    },
    initTree() {
      const _this = this
      const setting = {
        data: {
          keep: {
            leaf: false,
            parent: false
          }
        },
        view: {
          fontCss: fontCss,
          selectedMulti: false
        },
        edit: {
          drag: {
            isCopy: false,
            isMove: true,
            prev: dropPrev,
            inner: dropInner,
            next: dropNext
          },
          enable: true,
          showRenameBtn: false,
          showRemoveBtn: false
        },
        callback: {
          beforeDrag: beforeDrag,
          beforeDrop: _this.beforeDrop,
          onDrop: _this.onDrop,
          onClick: onClick
        }
      }
      function dropPrev(treeId, nodes, targetNode) {
        var pNode = targetNode.getParentNode()
        // if (pNode && pNode.dropInner === false) {
        //   return false
        // } else {
        //   for (var i = 0, l = curDragNodes.length; i < l; i++) {
        //     var curPNode = curDragNodes[i].getParentNode()
        //     if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
        //       return false
        //     }
        //   }
        // }
        const node = nodes[0]
        const parentNode = node.getParentNode()
        const fatherXsdnode = _this.buildXsdnode(parentNode)
        const newFatherXsdnode = _this.buildXsdnode(pNode)
        if (fatherXsdnode !== newFatherXsdnode) {
          // 跨级拖拽
          if (_this.isSameName(pNode, node.name)) {
            return false
          }
        }
        // 判断位置，node/property
        const isnode = typeof node.isnode !== 'undefined' ? node.isnode : true
        const isnode1 = typeof targetNode.isnode !== 'undefined' ? targetNode.isnode : true
        const preNode = targetNode.getPreNode()
        // 同类型位置可拖拽，或者node拖拽到第一个property的prev位置
        if (isnode === isnode1 || isnode && !isnode1 && (preNode === null || preNode.isnode !== false)) {
          return true
        }
        return false
      }
      function dropInner(treeId, nodes, targetNode) {
        // if (targetNode && targetNode.dropInner === false) {
        //   return false
        // } else {
        //   for (var i = 0, l = curDragNodes.length; i < l; i++) {
        //     if (!targetNode && curDragNodes[i].dropRoot === false) {
        //       return false
        //     } else if (curDragNodes[i].parentTId && curDragNodes[i].getParentNode() !== targetNode && curDragNodes[i].getParentNode().childOuter === false) {
        //       return false
        //     }
        //   }
        // }
        const node = nodes[0]
        return !_this.isSameName(targetNode, node.name) && (targetNode && targetNode.isnode !== false || !targetNode)
        // return true
      }
      function dropNext(treeId, nodes, targetNode) {
        var pNode = targetNode.getParentNode()
        // if (pNode && pNode.dropInner === false) {
        //   return false
        // } else {
        //   for (var i = 0, l = curDragNodes.length; i < l; i++) {
        //     var curPNode = curDragNodes[i].getParentNode()
        //     if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
        //       return false
        //     }
        //   }
        // }
        const node = nodes[0]
        const parentNode = node.getParentNode()
        const fatherXsdnode = _this.buildXsdnode(parentNode)
        const newFatherXsdnode = _this.buildXsdnode(pNode)
        if (fatherXsdnode !== newFatherXsdnode) {
          // 跨级拖拽
          if (_this.isSameName(pNode, node.name)) {
            return false
          }
        }
        // 判断位置，node/property
        const isnode = typeof node.isnode !== 'undefined' ? node.isnode : true
        const isnode1 = typeof targetNode.isnode !== 'undefined' ? targetNode.isnode : true
        const nextNode = targetNode.getNextNode()
        // 同类型位置可拖拽，或者property拖拽到最后一个node的next位置
        if (isnode === isnode1 || !isnode && isnode1 && (nextNode === null || nextNode.isnode === false)) {
          return true
        }
        return false
      }
      function beforeDrag(treeId, treeNodes) {
        return true
      }
      function fontCss(treeId, treeNode) {
        const isNode = treeNode.isnode
        if (treeNode.isParent) {
          return {}
        }
        if (typeof isNode === 'undefined' || isNode) {
          return { 'color': 'blue' }
        }
        return { 'color': 'red' }
      }
      function onClick(event, treeId, treeNode) {
        _this.treeNode = treeNode
      }
      const zNodes = _this.treeData
      $.fn.zTree.init($('#ztree'), setting, zNodes)
      const ztree = $.fn.zTree.getZTreeObj('ztree')
      ztree.expandAll(true)
      // false 过滤不加颜色不高亮提示
      fuzzySearch('ztree', '#key', false, true) // 初始化模糊搜索方法
    }
  }
}
</script>
