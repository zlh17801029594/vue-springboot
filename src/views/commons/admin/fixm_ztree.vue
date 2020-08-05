<template>
  <el-container v-loading="loading" :element-loading-text="text">
    <el-header align="left" style="height: 40px; line-height: 0; padding: 0; padding-bottom: 4px">
      <el-col :span="12">
        <el-form label-position="left" inline label-width="80px" class="inlineform">
          <el-form-item>
            <el-cascader
              v-model="validateFile"
              :options="validateFileOptions"
              :props="{ expandTrigger: 'hover', value: 'name', label: 'name' }"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="1">指定验证文件</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" style="padding: 0 20px">
        <el-tooltip placement="top" effect="light">
          <div slot="content">{{ lockType | lockTipFilter }}</div>
          <el-button type="primary" :icon="lockType | lockIconFilter" @click="lockType = lockType === 'lock' ? 'unlock' : 'lock'" style="margin: 0;">{{ lockType | lockTextFilter }}</el-button>
        </el-tooltip>
        <el-button type="primary" v-show="addRootShow" @click="handleAddRootNode" style="margin: 0;">添加根节点</el-button>
        <el-button type="primary" :disabled="!isAddNode || addShow" @click="handleAddNode" style="margin: 0;">添加子节点</el-button>
        <el-button type="primary" :disabled="!isUpdateNode || editShow" @click="handleUpdateNode" style="margin: 0;">更新</el-button>
        <el-button type="danger" :disabled="!isDeleteNode" @click="handleDeleteNode" style="margin: 0;">删除</el-button>
      </el-col>
    </el-header>
    <el-container style="height: calc(100vh - 164px - 51px); padding: 0">
      <el-aside style="width: 50%; padding: 0; margin: 0; background: #FFF;">
        <el-card style="min-height: 100%">
          <el-input id="key" v-model="key" placeholder="请输入关键字" prefix-icon="el-icon-search" />
          <!-- 上传验证文件 -->
          <!-- <uploader :key="uploader_key" :options="uploaderOptions" class="uploader-example" @file-success="onFileSuccess">
            <uploader-drop>
              <uploader-btn :directory="true" :single="true">选择文件夹</uploader-btn>
            </uploader-drop>
            <uploader-list></uploader-list>
          </uploader> -->
          <ul id="zTree" class="ztree" />
          <!-- <el-tree :data="treeData" :props="{label: 'name'}" node-key="?" draggable highlight-current :allow-drag="handleAllowDrag" :allow-drop="handleAllowDrop" @node-click="handleNodeClick" /> -->
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
                <el-select v-show="inputShow" v-model="form.srcColumn" style="width: 100%" placeholder="请选择数据源字段" :clearable="true">
                  <el-option v-for="(columnName, index) in keys" :key="index" :label="columnName" :value="columnName" />
                </el-select>
                <!-- 值调整，只有出现在list中才展示 -->
                <span v-show="!inputShow">{{ form.srcColumn }}</span>
              </el-col>
            </el-form-item>
            <el-form-item v-show="leafShow" label="测试值" prop="testvalue">
              <el-col :span="12">
                <div v-show="inputShow">
                  <el-input v-if="analyInput() === 'String'" v-model="upperTestValue" />
                  <el-input v-else-if="analyInput() === 'Integer' || analyInput() === 'Long'" v-model.number="numberTestValue" />
                  <el-select v-else-if="analyInput() === 'Boolean'" v-model="form.testvalue" style="width: 100%" >
                    <el-option label="true" :value="true" />
                    <el-option label="false" :value="false" />
                  </el-select>
                  <el-date-picker type="datetime" v-else-if="analyInput() === 'Date'" value-format="yyyy-MM-dd HH:mm" v-model="form.testvalue" style="width: 100%" />
                  <el-input v-else :disabled="true" />
                </div>
                <span v-show="!inputShow">{{ form.testvalue }}</span>
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
    <el-dialog 
      :visible.sync="dialogVisible"
      width="500px"
      center>
      <span slot="title">
        拖动到<span style="color: teal">{{ targetName }}</span>的什么位置？
      </span>
      <div style="width: 100%; text-align: center;">
        <el-radio-group v-model="drawProp.moveType">
          <el-radio label="prev" :disabled="!dropTypes[0]" border style="margin-right: 0;">上方</el-radio>
          <el-radio label="inner" :disabled="!dropTypes[1]" border style="margin-right: 0;">里面</el-radio>
          <el-radio label="next" :disabled="!dropTypes[2]" border style="margin-right: 0;">下方</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleDragFixm(drawProp)">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import { getFixm, addFixm, updateFixm, updateFixmName, drawFixm, delFixm, keys, map, validateFixm, validateFiles, uploadValidateFile } from '@/api/fixm'
const split_sign = '->'
let baseURL = process.env.VUE_APP_BASE_API
if(!baseURL.endsWith('/')){
  baseURL = baseURL + '/'
}
if(baseURL.startsWith('/')){
  baseURL = baseURL.substring(baseURL.length - 1)
}
const lockIcon = {
  lock: 'el-icon-lock',
  unlock: 'el-icon-unlock'
}
const lockText = {
  lock: '解锁布局',
  unlock: '锁定布局'
}
const lockTip = {
  lock: '解锁后可以进行位置拖动!',
  unlock: '锁定后不可进行位置拖动'
}
export default {
  name: 'FixmPanel',
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
      zTree: null,
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
      },
      columnsDesc: [],
      map: {},
      loading: false,
      text: '',
      firstShow: false,
      uploader_key: new Date().getTime(),
      uploaderOptions: {
        target: baseURL + 'fixmlogic/' + this.version + '/uploadValidateFile',
        testChunks: false
      },
      validateFile: '',
      validateFileOptions: [],
      dialogVisible: false,
      targetName: '',
      drawProp: {
        treeId: '',
        treeNodes: [],
        targetNode: null,
        moveType: ''
      },
      dropTypes: [true, true, true],
      lockType: 'lock'
    }
  },
  filters: {
    lockIconFilter(lockType) {
      return lockIcon[lockType]
    },
    lockTextFilter(lockType) {
      return lockText[lockType]
    },
    lockTipFilter(lockType) {
      return lockTip[lockType]
    }
  },
  props: {
    version: {
      type: String,
      default: 'core4.1'
    }
  },
  computed: {
    inputShow() {
      return this.addShow || this.editShow
    },
    upperTestValue: {
      get: function() {
        return this.form.testvalue
      },
      set: function(val) {
        this.form.testvalue = val.toUpperCase()
      }
    },
    numberTestValue: {
      get: function() {
        return this.form.testvalue
      },
      set: function(val) {
        if (val === '') {
          val = undefined
        }
        this.form.testvalue = val
      }
    },
    keys() {
      return this.columnsDesc.map(item => item.name)
    },
    addRootShow() {
      return this.firstShow && this.treeData && this.treeData.length === 0
    }
  },
  watch: {
    treeNode() {
      this.info()
    },
    'form.srcColumn'(value) {
      this.form.testvalue = this.map[value]
      console.log('srcColumn: ',value)
      console.log('testvalue: ',this.form.testvalue)
    },
    form(value) {
      console.log('form: ', value)
    },
    zTree(value) {
      console.log('zTree', value)
      console.log('nodes', value.getNodes())
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // el-tree回调函数
    handleNodeClick(data, node, e) {
      console.log('ell-tree: ', data, node, e)
    },
    handleAllowDrag(node) {
      return true
    },
    handleAllowDrop(draggingNode, dropNode, type) {
      return true
    },
    // vue-simple-uploader回调函数
    onFileSuccess(rootFile, file, response, chunk) {

    },
    // el-cascader级联选择器回调
    handleChange(val) {
      console.log('级联选择器', val)
    },
    // 计算当前输入框类型
    analyInput() {
      const srcColumn = this.form.srcColumn
      if (srcColumn) {
        for (const v of this.columnsDesc) {
          if (v.name === srcColumn) {
            return v.javaType
          }
        }
      }
      return false
    },
    // 增加多层级子节点时注意 isnode应该为true(第一层级)
    addChildIndex(treeNode, isnode) {
      let items
      if (treeNode) {
        items = treeNode.children
      } else {
        items = this.zTree.getNodes()
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
        items = this.zTree.getNodes()
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
        items = this.zTree.getNodes()
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
      const name = nodes.shift()
      if (nodes && nodes.length > 0) {
        const child = this.buildNode(nodes, fixmLogic)
        return {
          name: name,
          isnode: true,
          children: [child]
        }
      } else {
        fixmLogic.name = name
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
    hasSrcColumn(treeNode) {
      const isParent = treeNode.isParent
      const srcColumn = treeNode.srcColumn
      if (isParent) {
        const children = treeNode.children
        return children.some(item => {
          return this.hasSrcColumn(item)
        })
      } else {
        if (srcColumn) {
          return true
        } else {
          return false
        }
      }
    },
    recurisionTreeData(treeNode, level) {
      const children = treeNode.children
      if (children && level < 5) {
        treeNode.open = true
        children.forEach(item => {
          this.recurisionTreeData(item, level + 1)
        })
      }
    },
    getList() {
      getFixm(this.version).then(response => {
        console.log(response)
        this.treeData = response.data
        // 解决dom数据来回响应问题
        this.$nextTick(() => {
          this.firstShow = true
        })
        // 当只有一个节点时，操作很流畅，因此是zTree导致的
        // this.treeData = [{name: 'xiaozhou'}]
        // this.loading = true
        // this.text = '加载中...'
        this.treeData.forEach(item => this.recurisionTreeData(item, 1))
        this.initTree(this.treeData)
        // this.loading = false
      })
      keys(this.version).then(response => {
        this.columnsDesc = response.data
      })
      map(this.version).then(response => {
        this.map = response.data
        // if (this.form.srcColumn && this.map) {
        //   this.form.testvalue = this.map[this.form.srcColumn]
        // } else {
        //   this.form.testvalue = undefined
        // }
      })
      validateFiles(this.version).then(response => {
        this.validateFileOptions = response.data
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
      // this.form = Object.assign({}, treeNode)
      Object.assign(this.form, treeNode)
      this.form.testvalue = this.map[this.form.srcColumn]
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
    updateMap(srcColumn, testvalue) {
      if (srcColumn) {
        this.map[srcColumn] = testvalue
      }
    },
    validateFixm() {
      // 提示验证
      this.$confirm('是否立即验证', '提示', {
        confirmButtonText: '立即验证',
        cancelButtonText: '稍后验证',
        type: 'success'
      }).then(_ => {
        console.log('立即验证')
        setTimeout(() => {
          this.loading = true
          this.text = '验证中...'
          validateFixm(this.version).then(response => {
            this.loading = false
            this.$alert('验证成功', '验证结果', {
              confirmButtonText: '确定',
              type: 'success'
            })
          }).catch(res => {
            this.loading = false
            if (res.code === 450) {
              this.getList()
            } else if (res.code === 606) {
              this.$alert('失败原因：' + res.message, '验证结果', {
                confirmButtonText: '确定',
              })
            }
          })
        }, 50)
      }).catch(_ => {
        console.log('稍后验证')
      })
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
          const zTree = this.zTree
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
          // 后台接口参数
          tempData.fatherXsdnode = fatherXsdnode
          tempData.nodeOrder = nodeOrder
          tempData.propertyOrder = propertyOrder
          this.$confirm('确认添加：[' + tempData.name + ']', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(_ => {
            addFixm(this.version, tempData).then(_ => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              // 用于判断 更新map、验证fixm
              const srcColumn = this.form.srcColumn
              const testvalue = this.form.testvalue
              const name = this.form.name
              const nodes = name.split('->')
              let node
              if (nodes.length == 1) {
                node = this.form
              } else {
                node = this.buildNode(nodes, this.form)
              }
              // 添加节点位置
              const index = this.addChildIndex(treeNode, isnode)
              zTree.addNodes(treeNode, index, node)
              // 刷新树节点
              // zTree.refresh()

              // testvalue更新 转换为=>更新map值
              this.updateMap(srcColumn, testvalue)
              // 操作界面置空（或者调用 this.info() 展示详情信息）
              // this.treeNode = null
              this.info()
              // 验证
              if (srcColumn) {
                this.validateFixm()
              }
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
    handleAddRootNode() {
      this.resetShow()
      const parentName = '根节点'
      this.form.parentName = parentName
      // 显示表单
      this.isShow = true
      // 显示表单添加按钮
      this.addShow = true
      // 添加逻辑为直接添加叶子节点
      this.leafShow = true
    },
    handleUpdateNode() {
      this.commonShow()
      // 显示表单更新按钮
      this.editShow = true
    },
    updateNode() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.form)
          const zTree = this.zTree
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
          if (treeNode.isParent) {
            tempData.xsdnode = xsdnode
            tempData.newName = tempData.name
            tempData.nodeOrder = nodeOrder
            tempData.propertyOrder = propertyOrder
            this.$confirm('确认更新：[' + treeNode.name + ']', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(_ => {
              updateFixmName(this.version, tempData).then(_ => {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                treeNode.name = this.form.name
                zTree.updateNode(treeNode)
                // 刷新树节点
                // zTree.refresh()
                // 操作界面置空（或者调用 this.info() 展示详情信息）
                // this.treeNode = null
                this.info()
                if (this.hasSrcColumn(treeNode)) {
                  this.validateFixm()
                }
              }).catch(res => {
                if (res.code === 450) {
                  this.getList()
                }
              })
            }).catch(_ => {
            })
          } else {
            tempData.xsdnode = xsdnode
            tempData.newName = tempData.name
            tempData.nodeOrder = nodeOrder
            tempData.propertyOrder = propertyOrder
            this.$confirm('确认更新：[' + treeNode.name + ']', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(_ => {
              updateFixm(this.version, tempData).then(_ => {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                // 用于判断 更新map、验证fixm
                const srcColumn = this.form.srcColumn
                const testvalue = this.form.testvalue
                Object.assign(treeNode, this.form)
                zTree.updateNode(treeNode)
                // 刷新树节点
                // zTree.refresh()
                
                this.updateMap(srcColumn, testvalue)
                // info在更新map后面有利于展示
                this.info()
                if (srcColumn) {
                  this.validateFixm()
                }
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
    handleDragFixm(drawProp) {
      const treeId = drawProp.treeId, treeNodes = drawProp.treeNodes, targetNode = drawProp.targetNode, moveType = drawProp.moveType
      console.log(treeNodes, targetNode, targetNode ? targetNode.name : '根节点', moveType)
      const zTree = this.zTree
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
        console.log('节点是否已变更', fathNode, newFatherNode, fathNode === newFatherNode)
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
      let deleteNode, deleteXsdnode
      let saveFather = this.saveFather(sourceNode)
      // 此注释代码的运行 需要在函数前添加异步转同步操作支持
      // if (saveFather) {
      //   const blankFather = this.blankFather(sourceNode.getParentNode())
      //   await this.$confirm('是否删除空白目录：[' + blankFather.name + ']', '提示', {
      //     confirmButtonText: '删除',
      //     cancelButtonText: '保留',
      //     type: 'warning'
      //   }).then(_ => {
      //     // 删除空目录，生成deleteXsdnode
      //     deleteNode = blankFather
      //     deleteXsdnode = this.buildXsdnode(blankFather)
      //     // 无需保留父节点
      //     saveFather = false
      //   }).catch(_ => {
      //     // 保留空目录，返回值重要
      //     // fixmLogic.saveFather = true
      //   })
      //   console.log('is save')
      // }
      drawFixm(this.version, {
        deleteXsdnode: deleteXsdnode,
        saveFather: saveFather,
        xsdnode: xsdnode,
        newFatherXsdnode: newFatherXsdnode,
        nodeOrder: nodeOrder,
        propertyOrder: propertyOrder,
        newNodeOrder: newNodeOrder,
        newPropertyOrder: newPropertyOrder
      }).then(response => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.dialogVisible = false
        // 拖拽节点
        zTree.moveNode(targetNode, treeNodes[0], moveType)
        // 删除空节点
        if (deleteNode) {
          zTree.removeNode(deleteNode, false)
        }
        // 刷新树节点
        // zTree.refresh()
        console.log(fathNode)

        // 操作界面置空（或者调用 this.info() 展示详情信息）
        this.treeNode = null
        // this.info()
        if (this.hasSrcColumn(sourceNode)) {
          this.validateFixm()
        }
      }).catch(res => {
        if (res.code === 450) {
          this.getList()
        }
      })
    },
    async handleDeleteNode() {
      const zTree = this.zTree
      let treeNode = this.treeNode
      const isParent = treeNode.isParent
      let message = '确认删除：[' + treeNode.name + ']'
      if (isParent) {
        message += '及其子节点'
      }
      await this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async _ => {
        let saveFather = this.saveFather(treeNode)
        if (saveFather) {
          const blankFather = this.blankFather(treeNode.getParentNode())
          await this.$confirm('是否删除空白目录：[' + blankFather.name + ']', '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '保留',
            type: 'warning'
          }).then(_ => {
            // 删除空目录，删除节点更改
            treeNode = blankFather
            // 无需保留父节点
            saveFather = false
          }).catch(_ => {
            // 保留空目录，返回值重要
            // fixmLogic.saveFather = true
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
        // 提交后台数据
        const fixmLogic = {
          xsdnode: xsdnode,
          nodeOrder: nodeOrder,
          propertyOrder: propertyOrder,
          saveFather: saveFather
        }
        delFixm(this.version, fixmLogic).then(_ => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          zTree.removeNode(treeNode, false)
          // 刷新树节点
          // zTree.refresh()
          
          this.treeNode = null
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
      const zTree = this.zTree
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
            delFixm(this.version, fixmLogic).then(_ => {
              zTree.removeNode(treeNode, false)
              // 刷新树节点
              // zTree.refresh()
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
          delFixm(this.version, fixmLogic).then(_ => {
            zTree.removeNode(treeNode, false)
            // 刷新树节点
            // zTree.refresh()
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
      this.targetName = targetNode ? targetNode.name : '根节点'
      this.dropTypes[0] = this.dropPrev(treeId, treeNodes, targetNode)
      this.dropTypes[1] = this.dropInner(treeId, treeNodes, targetNode)
      this.dropTypes[2] = this.dropNext(treeId, treeNodes, targetNode)
      this.drawProp = {
        treeId: treeId,
        treeNodes: treeNodes,
        targetNode: targetNode,
        moveType: moveType
      }
      this.dialogVisible = true
      // this.handleDragFixm(treeId, treeNodes, targetNode, moveType)
      return false
    },
    onDrop(event, treeId, treeNodes, targetNode, moveType) {
      // 未拖拽成功会回调该函数。不会回调beforeDrop()
      console.log(treeNodes, targetNode, moveType)
      if (!moveType) {
        console.log('未拖拽')
      }
    },
    beforeDrag(treeId, treeNodes) {
      // console.log('this.lockType !== \'lock\'', this.lockType !== 'lock')
      if (this.lockType === 'lock') {
        this.$notify({
          title: '拖动提示',
          message: '布局已锁定！请先解锁',
          type: 'warning',
          duration: 2000,
          offset: 100
        })
      }
      return this.lockType !== 'lock'
    },
    onClick(event, treeId, treeNode) {
      console.log('onClick', treeNode.name)
      this.treeNode = treeNode
    },
    fontCss(treeId, treeNode) {
      const isNode = treeNode.isnode
      if (treeNode.isParent) {
        return {}
      }
      if (typeof isNode === 'undefined' || isNode) {
        return { 'color': 'blue' }
      }
      return { 'color': '#8A2BE2' }
    },
    dropPrev(treeId, nodes, targetNode) {
      if (!targetNode) {
        // 方便主动调佣。回调不会出现targetNode为null的情况
        return false
      }
      var pNode = targetNode.getParentNode()
      const node = nodes[0]
      const parentNode = node.getParentNode()
      if (parentNode !== pNode && this.isSameName(pNode, node.name)) {
        // 跨级拖拽
        return false
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
    },
    dropInner(treeId, nodes, targetNode) {
      const node = nodes[0]
      return (targetNode && targetNode.isnode !== false || !targetNode) && !this.isSameName(targetNode, node.name)
    },
    dropNext(treeId, nodes, targetNode) {
      if (!targetNode) {
        // 方便主动调佣。回调不会出现targetNode为null的情况
        return false
      }
      var pNode = targetNode.getParentNode()
      const node = nodes[0]
      const parentNode = node.getParentNode()
      if (parentNode !== pNode && this.isSameName(pNode, node.name)) {
        // 跨级拖拽
        return false
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
    },
    initTree(treeData) {
      const _this = this
      const setting = {
        data: {
          keep: {
            leaf: false,
            parent: false
          }
        },
        view: {
          fontCss: _this.fontCss,
          selectedMulti: false
        },
        edit: {
          drag: {
            isCopy: false,
            isMove: true,
            prev: _this.dropPrev,
            inner: _this.dropInner,
            next: _this.dropNext
          },
          enable: true,
          showRenameBtn: false,
          showRemoveBtn: false
        },
        callback: {
          beforeDrag: _this.beforeDrag,
          beforeDrop: _this.beforeDrop,
          onDrop: _this.onDrop,
          onClick: _this.onClick
        }
      }
      $.fn.zTree.init($('#zTree'), setting, treeData)
      this.zTree = $.fn.zTree.getZTreeObj('zTree')
      // this.zTree.expandAll(true)
      // false 过滤不加颜色不高亮提示
      fuzzySearch('zTree', '#key', false, true) // 初始化模糊搜索方法
    }
  }
}
</script>
<style>
  .uploader-example {
    width: 90%;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }
 
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
 
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
<style scoped>
  .inlineform .el-form-item {
    margin-bottom: 0;
    margin-right: 0;
  }
</style>