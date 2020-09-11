<template>
  <div v-loading="loading" :element-loading-text="text">
    <el-row align="left" style="height: 40px; line-height: 0; padding: 0; padding-bottom: 4px">
      <el-col style="min-width: 588px;">
        <el-button type="success" icon="el-icon-upload" @click="uploadVisible = true" style="margin: 0;">上传验证文件</el-button>
        <el-cascader
          v-model="validateFile"
          placeholder="请选取验证文件！"
          :show-all-levels = "false"
          :options="validateFileOptions"
          :props="{ expandTrigger: 'click', value: 'name', label: 'name' }"
          @change="handleChange"
          @focus="focus"
          style="width: 200px">
          <template slot-scope="{ node, data }">
            <span>{{ data.name }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
        <!-- 有数据时展示，和添加根节点相反 -->
        <el-tooltip content="对当前数据进行一次验证！" placement="top" effect="light" :hide-after="3000">
          <el-button type="primary" @click="handleValidateFixm()" style="margin: 0;">验证</el-button>
        </el-tooltip>

      </el-col>
      <!-- <el-col :span="12" style="padding-left: 4px"> -->
        <!-- <el-tooltip placement="top" effect="light">
          <div slot="content">{{ lockType | lockTipFilter }}</div>
          <el-button :type="lockType === 'lock' ? 'primary' : 'success'" :icon="lockType | lockIconFilter" @click="lockType = lockType === 'lock' ? 'unlock' : 'lock'" style="margin: 0;">{{ lockType | lockTextFilter }}</el-button>
        </el-tooltip> -->
        <!-- <el-button type="primary" v-show="isAddRootShow" @click="handleAddRoot" style="margin: 0;">添加根节点</el-button> -->
        <!-- <el-button type="primary" :disabled="!isAddNode || addShow" @click="handleAdd(treeNode)" style="margin: 0;">添加子节点</el-button> -->
        <!-- 方案二 -->
        <!-- <el-button type="primary" :disabled="!isUpdateNode || updateShow" @click="handleEdit(treeNode)" style="margin: 0;">编辑</el-button> -->
        <!-- <el-button type="danger" :disabled="!isDeleteNode" @click="handleDeleteNode(treeNode)" style="margin: 0;">删除</el-button> -->
      <!-- </el-col> -->
    </el-row>
    <el-row style="height: calc(100vh - 124px - 40px); display: flex;" :gutter="8">
      <el-col :span="12">
        <div style="height: calc(100%); padding: 1px; border: 1px solid #eee; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 4px;">
          <div style="min-width: 288px;">
            <el-input id="key" v-model="key" placeholder="请输入关键字" prefix-icon="el-icon-search" 
              :style="'width: calc(100%' + ( subversion ? (subversionEdit ? ' - 145px' : ' - 123px') : (' - 123px' + (isAddRootShow ? ' - 118px' : ''))) + ')'" />
            <el-tooltip placement="top" :enterable="false" effect="light">
              <div slot="content">{{ lockType | lockTipFilter }}</div>
              <el-button :type="lockType === 'lock' ? 'primary' : 'success'" v-show="!subversion" :icon="lockType | lockIconFilter" @click="lockType = lockType === 'lock' ? 'unlock' : 'lock'" style="margin: 0;">{{ lockType | lockTextFilter }}</el-button>
            </el-tooltip>
            <el-button type="primary" v-show="!subversion && isAddRootShow" @click="handleAddRoot" style="margin: 0;">添加根节点</el-button>
            
            <el-tooltip placement="top" :enterable="false" effect="light">
              <div slot="content">从版本中<span style="color: teal">勾选/取消勾选</span>节点</div>
              <el-button v-show="subversion && !subversionEdit" type="primary" icon="el-icon-edit" @click="editSubversion()" style="margin: 0;">编辑模板</el-button>
            </el-tooltip>
            <el-button-group v-show="subversion && subversionEdit">
              <el-button type="success" @click="saveSubversion()">保存</el-button>
              <el-button type="" @click="chsSubversion()">取消</el-button>
            </el-button-group>
          </div>
          <div style="height: calc(100% - 36px);">
            <el-scrollbar class="page-component__scroll">
              <ul id="zTree" class="ztree" />
            </el-scrollbar>
          </div>
        </div>
        <!-- <el-tree :data="treeData" :props="{label: 'name'}" node-key="?" draggable highlight-current :allow-drag="handleAllowDrag" :allow-drop="handleAllowDrop" @node-click="handleNodeClick" /> -->
      </el-col>
      <el-col :span="12">
        <div style="height: calc(100%); padding: 1px; padding-top: 36px; border: 1px solid #eee; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); border-radius: 4px;">
          <el-scrollbar class="page-component__scroll">
            <el-form style="padding: 5px;" v-show="isShow" ref="form" :validate-on-rule-change="false" :model="form" label-position="left" label-width="100px" class="demo-table-expand1">
              <el-form-item v-show="addShow" label="父节点名" prop="parentName">
                <el-input v-model="parentName" :disabled="true" />
              </el-form-item>
              <!-- 增加子节点，有增加多层级子节点需求 -->
              <el-form-item v-show="addShow" 
                v-for="(name, index) in form.dynamicNames"
                :label="'子节点名' + (form.dynamicNames.length > 1 ? (index + 1) : '')"
                :key="name.key"
                :prop="'dynamicNames.' + index + '.value'"
                :rules="addShow ? (index === 0 ? nameAddRule : nameAddChildRule) : {}">
                <el-input v-model="name.value"></el-input>
                <el-tooltip :disabled="index !== 0" placement="top" effect="light" content="增加多层级子节点">
                  <el-button type="success" @click="addDomain(name)" style="margin: 0;" icon="el-icon-plus"></el-button>
                </el-tooltip>
                <el-tooltip :disabled="index !== 0" placement="top" effect="light" content="移除当前层级节点">
                  <el-button v-show="form.dynamicNames.length > 1" @click="removeDomain(name)" style="margin: 0;" icon="el-icon-minus"></el-button>
                </el-tooltip>
              </el-form-item>
              <!-- 其他操作 节点名项 -->
              <el-form-item v-show="!addShow" label="节点名" prop="name"
                :rules="updateShow ? nameEditRule : {}">
                <el-input v-show="inputShow" v-model="form.name" />
                <div v-show="!inputShow" class="aspan">{{ form.name }}</div>
              </el-form-item>
              <el-form-item v-show="leafShow" label="数据源字段" prop="srcColumn">
                <el-select v-show="inputShow" v-model="form.srcColumn" style="width: 100%" placeholder="请选择数据源字段" :clearable="true">
                  <el-option v-for="(columnName, index) in keys" :key="index" :label="columnName" :value="columnName" />
                </el-select>
                <!-- 值调整，只有出现在list中才展示 -->
                <div v-show="!inputShow" class="aspan">{{ form.srcColumn }}</div>
              </el-form-item>
              <el-form-item v-show="leafShow" label="测试值" prop="testvalue">
                <div v-show="inputShow">
                  <el-input v-if="dbColumn && dbColumn.javaType === 'String'" 
                    :type="(dbColumn.length === 0 || dbColumn.length > 50) ? 'textarea' : 'text'"
                    :maxlength="(dbColumn.length !== 0) ? dbColumn.length : undefined"
                    show-word-limit
                    :autosize="{minRows: 2}" 
                    v-model="upperTestValue" />
                  <el-input-number class="inputNumber" v-else-if="dbColumn && dbColumn.javaType === 'Integer'" 
                    :min="dbColumn.minValue ? dbColumn.minValue : undefined"
                    :max="dbColumn.maxValue ? dbColumn.maxValue : undefined"
                    v-model="numberTestValue" />
                  <el-select v-else-if="dbColumn && dbColumn.javaType === 'Boolean'" v-model="form.testvalue" style="width: 100%" >
                    <el-option label="true" :value="true" />
                    <el-option label="false" :value="false" />
                  </el-select>
                  <!-- el-date-picker尺寸不能通过 form .el-input全局控制，需单独赋值 -->
                  <el-date-picker type="datetime" v-else-if="dbColumn && dbColumn.javaType === 'Date'" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" v-model="form.testvalue" style="width: calc(100% - 120px);" />
                  <el-input v-show="!dbColumn" :disabled="true" />
                </div>
                <div v-show="!inputShow" class="aspan">{{ form.testvalue }}</div>
              </el-form-item>
              <el-form-item v-show="leafShow" label="节点/属性" prop="isnode"
                :rules="leafShow ? (inputShow ? nodeRule : {required: false}) : {required: false}">
                <el-select v-show="inputShow" v-model="form.isnode" clearable style="width: 100%" :disabled="updateShow" placeholder="请选择类型">
                  <el-option label="节点" :value="true" />
                  <el-option label="属性" :value="false" />
                </el-select>
                <div v-show="!inputShow" class="aspan">{{ form.isnode ? '节点' : '属性' }}</div>
              </el-form-item>
              <el-form-item v-show="leafShow" label="字段解释" prop="explain">
                <el-input v-show="inputShow" v-model="form.explain" />
                <div v-show="!inputShow" class="aspan">{{ form.explain }}</div>
              </el-form-item>
              <el-form-item v-show="leafShow" label="扩展文件名" prop="fileextension">
                <el-input v-show="inputShow" v-model="form.fileextension" />
                <div v-show="!inputShow" class="aspan">{{ form.fileextension }}</div>
              </el-form-item>
              <el-form-item v-show="leafShow" label="转换方法" prop="convextension">
                <el-input v-show="inputShow" v-model="form.convextension" />
                <div v-show="!inputShow" class="aspan">{{ form.convextension }}</div>
              </el-form-item>
              <el-form-item v-show="leafShow" label="是否生效" prop="isvalid">
                <el-switch v-show="inputShow" v-model="form.isvalid" active-color="#13ce66" />
                <div v-show="!inputShow" class="aspan">{{ form.isvalid ? '是' : '否' }}</div>
              </el-form-item>
              <el-form-item>
                <!-- 方案一 -->
                <el-button v-show="updateShow" @click="handleBack" style="margin: 0;">返回</el-button>
                <el-button v-show="!inputShow && !subversion" type="primary" @click="handleUpdate" style="margin: 0;">编辑</el-button>
                <!-- 方案二 -->
                <!-- <el-button v-show="inputShow && !isAddRootShow" @click="handleInfo(treeNode)" style="margin: 0;">返回</el-button> -->
                <el-button v-show="addShow" type="primary" @click="addNode(treeNode)" style="margin: 0;">提交</el-button>
                <el-button v-show="updateShow" type="primary" @click="updateNode(treeNode)" style="margin: 0;">提交</el-button>
              </el-form-item>
            </el-form>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
    <el-dialog 
      :visible.sync="dialogVisible"
      width="500px"
      center>
      <span slot="title">
        拖动到<span style="color: teal"> {{ targetName }} </span>的什么位置？
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
    <el-dialog
      :visible.sync="uploadVisible"
      width="500px"
      center>
      <!-- 上传验证文件 -->
      <uploader :key="uploader_key" :options="uploaderOptions" class="uploader-example" @file-success="onFileSuccess" >
        <uploader-drop>
          <uploader-btn :directory="true" :single="true">上传验证文件</uploader-btn>
        </uploader-drop>
        <!-- <uploader-list>
          <template slot="file-list" scope="fileLists">
            <p>{{ fileLists }}</p>
            <p>{{ fileLists.size }}</p>
          </template>
        </uploader-list> -->
        <template slot-scope="files">
          <p>{{ files }}</p>
        </template>
      </uploader>
    </el-dialog>
  </div>
</template>
<script>
import { getFixm, addFixm, updateFixm, updateFixmName, drawFixm, delFixm, keys, map, validateFixm, validateFiles, getValidateMapValue, updateValidateMap, uploadValidateFile, updateSubversion, delSubversion } from '@/api/fixm'
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
const formOrigin = {
  name: undefined,
  srcColumn: undefined,
  isnode: undefined,
  explain: undefined,
  testvalue: undefined,
  fileextension: undefined,
  convextension: undefined,
  isvalid: true
}
export default {
  name: 'FixmPanel',
  data() {
    var validEditName = (rule, value, callback) => {
      if (value) {
        if (/(->)/.test(value)) {
          callback(new Error('节点名不能包含 ' + split_sign))
        }
        const pNode = this.treeNode.getParentNode()
        const name = this.treeNode.name
        if (name !== value && this.isSameName(pNode, value)) {
          callback(new Error('同级节点不能同名'))
        }
        callback()
      }
    }
    var validAddName = (rule, value, callback) => {
      if (/(->)/.test(value)) {
        callback(new Error('节点名不能包含 ' + split_sign))
      }
      if (this.isSameName(this.treeNode, value)){
        callback(new Error('同级节点不能同名'))
      }
      callback()
    }
    var validAddChildName = (rule, value, callback) => {
      if (/(->)/.test(value)) {
        callback(new Error('节点名不能包含 ' + split_sign))
      }
      callback()
    }
    return {
      treeData: [],
      // zTree过滤函数使用
      key: undefined,
      form: {
        name: undefined,
        srcColumn: undefined,
        isnode: undefined,
        explain: undefined,
        testvalue: undefined,
        fileextension: undefined,
        convextension: undefined,
        isvalid: true,
        dynamicNames: [{
          key: 0,
          value: ''
        }]
      },
      parentName: '',
      // 方案一：用于编辑返回按钮
      formOrigin: {},
      zTree: null,
      treeNode: null,
      isShow: false,
      isAddRootShow: false,
      isAddNode: false,
      isUpdateNode: false,
      isDeleteNode: false,
      leafShow: false,
      addShow: false,
      updateShow: false,
      // 1.不为空 2.不包含-> 3.不能重名
      nameAddRule: [
        { required: true, message: '节点名称不能为空', trigger: 'blur'}, 
        { validator: validAddName, trigger: 'change'}
      ],
      // 1.不为空 2.不包含->
      nameAddChildRule: [
        { required: true, message: '节点名称不能为空', trigger: 'blur'}, 
        { validator: validAddChildName, trigger: 'change'}
      ],
      // 1.不为空 2.不包含-> 3.不能重名(原名除外)
      nameEditRule: [
        { required: true, message: '节点名称不能为空', trigger: 'blur' },
        { validator: validEditName, trigger: 'change' }
      ],
      // 1.不为空
      nodeRule: [
        { required: true, message: '请选择类型', trigger: 'change' }
      ],
      columnsDesc: [],
      map: {},
      loading: false,
      text: '',
      uploader_key: new Date().getTime(),
      uploaderOptions: {
        target: baseURL + 'fixmlogic/' + this.version + '/uploadValidateFile',
        testChunks: false
      },
      validateFile: '',
      validateFileOrign: '',
      changeFlag: false,
      validateFileOptions: [],
      dialogVisible: false,
      uploadVisible: false,
      targetName: '',
      drawProp: {
        treeId: '',
        treeNodes: [],
        targetNode: null,
        moveType: ''
      },
      dropTypes: [true, true, true],
      lockType: 'lock',
      subversionFlag: false,
      subversionEdit: false
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
    },
    subversion: {
      type: String,
      default: ''
    }
  },
  computed: {
    inputShow() {
      return this.addShow || this.updateShow
    },
    upperTestValue: {
      get() {
        return this.form.testvalue
      },
      set(val) {
        this.form.testvalue = val.toUpperCase()
      }
    },
    numberTestValue: {
      get() {
        return this.form.testvalue
      },
      set(val) {
        if (val === '') {
          val = undefined
        }
        this.form.testvalue = val
      }
    },
    keys() {
      return this.columnsDesc.map(item => item.name)
    },
    dbColumn() {
      const srcColumn = this.form.srcColumn
      if (srcColumn) {
        for (const v of this.columnsDesc) {
          if (v.name === srcColumn) {
            console.log('column', v)
            return v
          }
        }
      }
    }
  },
  watch: {
    'form.srcColumn'(value) {
      this.form.testvalue = this.map[value]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    subversionHandler(newVal, oldVal) {
      console.log('子模板', newVal, oldVal)
      this.chsSubversion()
      // this.zTree.setting.edit.showRemoveBtn = newVal === ''
    },
    handleHideAll(){
      const showNodes = this.zTree.getNodesByParam('isHidden', false)
      this.zTree.hideNodes(showNodes)
    },
    handleShowAll(){
      const hideNodes = this.zTree.getNodesByParam('isHidden', true)
      this.zTree.showNodes(hideNodes)
    },
    filterSubversion(node, subversion) {
      // 条件：1.非目录、2.子模板列表包含当前子模板
      return (!node.isParent && node.subversions && node.subversions.indexOf(subversion) !== -1)
    },
    // 类似点击菜单回调
    chsSubversion() {
      const zTree = this.zTree
      const subversion = this.subversion
      if (subversion) {
        this.handleHideAll()
        const dNodes = zTree.getNodesByFilter(this.filterSubversion, false, null, subversion)
        if (dNodes) {
          dNodes.forEach(node => {
            zTree.showNodes(node.getPath())
          })
        }
        // 临时 代表进入子模板，可删除、编辑
        this.subversionFlag = true
      } else {
        this.handleShowAll()
        // 未进入任何子模板
        this.subversionFlag = false
      }
      // 后续操作可以理解为初始化

      // 切换子模板 隐藏勾选框(顺序放在展示节点后，先渲染、再隐藏)
      const rootNodes = zTree.getNodes()
      if (rootNodes && rootNodes.length) {
        this.recursionChk(rootNodes, true)
      }
      // 重置编辑
      this.subversionEdit = false
    },
    // 编辑/取消编辑 子节点操作
    editSubversion() {
      const zTree = this.zTree
      // 展示所有节点
      this.handleShowAll()
      // 展示勾选框(放在展示节点后)
      const rootNodes = zTree.getNodes()
      if (rootNodes && rootNodes.length) {
        this.recursionChk(rootNodes, false)
      }
      // 取消上次所有勾选
      zTree.checkAllNodes(false)
      // 勾选当前版本节点
      const subversion = this.subversion
      if (subversion) {
        const dNodes = zTree.getNodesByFilter(this.filterSubversion, false, null, subversion)
        if (dNodes) {
          dNodes.forEach(node => {
            zTree.checkNode(node, true, true)
          })
        }
        this.subversionEdit = true
      }
      // 记录当前勾选情况，用于更新成功后，局部修改subversions属性
      this.recursionBak(zTree.getNodes())
    },
    recursionBak(nodes) {
      nodes.forEach(node => {
        node.checkedOld = node.checked
        if (node.isParent) {
          this.recursionBak(node.children)
        }
      })
    },
    filterChecked(node, chkFlag) {
      return (!node.isParent && node.checked === chkFlag)
    },
    // 保存 子节点操作
    saveSubversion() {
      const zTree = this.zTree
      const subversion = this.subversion
      // 记录布局更新
      const changeNodes = zTree.getChangeCheckedNodes()
      console.log('变更节点', changeNodes)
      const chkNodes = [], cancelChkNodes = []
      changeNodes.forEach(node => {
        if (!node.isParent) {
          const chkFlag = node.checked
          if (chkFlag) {
            // 未选中=>选中
            chkNodes.push(node)
          } else {
            // 选中=>未选中
            cancelChkNodes.push(node)
          }
        }
      })
      console.log('实际变更', chkNodes, cancelChkNodes)
      // 记录全局更新[即只关注当前所有选中的节点]
      // const chkNodes = zTree.getNodesByFilter(this.filterChecked, false, null, true)
      const chkXsdnodes = chkNodes.map(node => this.buildXsdnode(node))
      const cancelChkXsdnodes = cancelChkNodes.map(node => this.buildXsdnode(node))
      updateSubversion(this.version, subversion, {
        'chkXsdnodes': chkXsdnodes,
        'cancelChkXsdnodes': cancelChkXsdnodes
      }).then(res => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        chkNodes.forEach(node => {
          node.subversions.push(subversion)
        })
        cancelChkNodes.forEach(node => {
          for (const v of node.subversions) {
            if (v === subversion) {
              const index = node.subversions.indexOf(v)
              node.subversions.splice(index, 1)
              break
            }
          }
        })
        this.chsSubversion()
      })
    },
    recursionChk(nodes, chkFlag) {
      nodes.forEach(node => {
        if (node.nocheck !== chkFlag) {
          node.nocheck = chkFlag
          this.zTree.updateNode(node)
        }
        if (node.isParent) {
          this.recursionChk(node.children, chkFlag)
        }
      })
    },
    addDomain(item) {
      var index = this.form.dynamicNames.indexOf(item)
      if (index !== -1) {
        this.form.dynamicNames.splice(index + 1, 0, {
          value: '',
          key: Date.now()
        });
      }
    },
    removeDomain(item) {
      var index = this.form.dynamicNames.indexOf(item)
      if (index !== -1) {
        this.form.dynamicNames.splice(index, 1)
        if (index === 0) {
          console.log('触发一次校验')
          this.$nextTick(() => {
            this.$refs['form'].validateField('dynamicNames.0.value')
          })
        }
      }
    },
    getList() {
      getFixm(this.version).then(response => {
        console.log(response)
        this.treeData = response.data
        // 解决dom数据来回响应问题
        this.$nextTick(() => {
          this.isAddRootShow = this.treeData && this.treeData.length === 0
        })
        // 当只有一个节点时，操作很流畅，因此是zTree导致的
        // this.treeData = [{name: 'xiaozhou'}]
        // this.loading = true
        // this.text = '加载中...'
        this.treeData.forEach(item => this.recurisionTreeData(item, 1))
        this.initTree(this.treeData)
        this.$watch('subversion', this.subversionHandler, {immediate: true})
        // this.loading = false

        validateFiles(this.version).then(response => {
          this.validateFileOptions = response.data
          getValidateMapValue(this.version).then(response => {
            this.validateFile = response.data
            this.$nextTick(() => {
              this.changeFlag = true
            })
          })
        })
        keys(this.version).then(response => {
          this.columnsDesc = response.data
        })
        map(this.version).then(response => {
          this.map = response.data
        })
      })
    },
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
    // el-cascader级联选择器 用户开始输入，提前备份validateFileOrign
    focus() {
      if (this.validateFile) {
        this.validateFileOrign = JSON.parse(JSON.stringify(this.validateFile))
      } else {
        this.validateFileOrign = ''
      }
    },
    // el-cascader级联选择器回调
    handleChange(val) {
      if (this.changeFlag){
        this.$confirm('是否更新验证文件为：' + (val ? val[val.length -1] : ''), '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'success'
        }).then(response => {
          updateValidateMap(this.version, val).then(response => {
            this.$message({
              type: 'success',
              message: '更新验证文件成功'
            })
          }).catch(_ => {
            this.changeFlag = false
            this.validateFile = this.validateFileOrign
            this.$nextTick(() => {
              this.changeFlag = true
            })
          })
        }).catch(_ => {
          this.changeFlag = false
          this.validateFile = this.validateFileOrign
          this.$nextTick(() => {
            this.changeFlag = true
          })
        })
        
      }
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
    // 查找子节点不同类型名称数组(更新排序序列需要) ok
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
    // 构建子节点排序序列(这是更新后的序列，好像没用处) ok
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
    // 生成xsdnode值 ok
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
    info() {
      const treeNode = this.treeNode
      if (treeNode) {
        // this.commonShow()
      } else {
        this.isAddNode = false
        this.isUpdateNode = false
        this.isDeleteNode = false
        this.isShow = false
      }
    },
    copyTreeNode2Form(treeNode) {
      if (!treeNode) {
        return {}
      }
      return {
        name: treeNode.name,
        srcColumn: treeNode.srcColumn,
        // 此字段也可脱离表单(调整： 后台已经不返回该字段)
        // testvalue: treeNode.testvalue,
        isnode: treeNode.isnode,
        explain: treeNode.explain,
        fileextension: treeNode.fileextension,
        convextension: treeNode.convextension,
        isvalid: treeNode.isvalid
      }
    },
    // 选取节点处理
    handleSelect(treeNode) {
      this.treeNode = treeNode
      if (!treeNode) {
        // 取消选中
        this.zTree.cancelSelectedNode()
        this.isAddNode = false
        this.isUpdateNode = false
        this.isDeleteNode = false
        this.isShow = false
      } else {
        // 选中节点
        this.zTree.selectNode(treeNode)
        // 节点操作按钮
        this.isAddNode = treeNode.isParent || treeNode.isnode
        this.isUpdateNode = true
        this.isDeleteNode = true
        // 表单展示
        this.isShow = true
        this.handleInfo(treeNode)
      }
    },
    handleInfo(treeNode) {
      this.leafShow = !treeNode.isParent
      // 表单操作按钮(update：更新、add：添加)
      this.updateShow = false
      this.addShow = false
      if (this.leafShow) {
        Object.assign(this.form, this.copyTreeNode2Form(treeNode))
      } else {
        Object.assign(this.form, formOrigin)
        this.form.name = treeNode.name
      }
      console.log('form表单信息', this.form)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    // 编辑方案一
    handleUpdate() {
      Object.assign(this.formOrigin, this.form)
      this.updateShow = true
    },
    handleBack() {
      Object.assign(this.form, this.formOrigin)
      this.updateShow = false
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    // 编辑方案二
    handleEdit(treeNode) {
      this.leafShow = !treeNode.isParent
      this.updateShow = true
      this.addShow = false
      if (this.leafShow) {
        Object.assign(this.form, this.copyTreeNode2Form(treeNode))
      } else {
        Object.assign(this.form, formOrigin)
        this.form.name = treeNode.name
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    // 添加节点界面无返回按钮，设计原因：添加根节点时没有选取的节点，无法展示节点内容。添加完成展示添加节点信息。
    handleAdd(treeNode) {
      // 表单展示
      this.isShow = true
      this.leafShow = true
      this.updateShow = false
      this.addShow = true
      this.resetForm()
      this.parentName = treeNode.name
      // 添加节点判断逻辑需要
      this.treeNode = treeNode
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    // 添加根节点，无需选取节点
    handleAddRoot() {
      // 表单展示
      this.isShow = true
      this.leafShow = true
      this.updateShow = false
      this.addShow = true
      this.resetForm()
      this.parentName = '根节点'
      // 添加根节点判断逻辑需要
      this.treeNode = null
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    handleDelete(treeNode) {

    },
    // 弃用
    commonShow() {
      // this.form = Object.assign({}, treeNode)
      // Object.assign(this.form, treeNode)
      // this.form = this.copyTreeNode2Form(treeNode)
      Object.assign(this.form, this.copyTreeNode2Form(treeNode))
    },
    resetForm() {
      Object.assign(this.form, formOrigin)
      this.form.dynamicNames = [{
        key: 0,
        value: ''
      }]
    },
    updateMap(srcColumn, testvalue) {
      if (srcColumn) {
        this.map[srcColumn] = testvalue
      }
    },
    // 验证按钮
    handleValidateFixm() {
      this.validateFixm()
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
                type: 'error'
              })
            }
          })
        }, 50)
      }).catch(_ => {
        console.log('稍后验证')
      })
    },
    findRealChild(treeNode) {
      if (treeNode.isParent) {
        return this.findRealChild(treeNode.children[0])
      }
      return treeNode
    },
    addNode(treeNode) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.name = this.form.dynamicNames.map(e => e.value).join(split_sign)
          const tempData = Object.assign({}, this.form)
          const zTree = this.zTree
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
          if (isnode) {
            // 添加 节点/多层级(目录)
            nodeOrderChildName.push(name)
          } else {
            // 添加 单层级属性
            propertyOrderChildName.push(name)
          }
          const nodeOrder = this.convertOrder(nodeOrderChildName)
          const propertyOrder = this.convertOrder(propertyOrderChildName)
          // 后台接口参数
          tempData.fatherXsdnode = fatherXsdnode
          tempData.nodeOrder = nodeOrder
          tempData.propertyOrder = propertyOrder
          this.$confirm('确认添加：<span style="color: teal">[' + tempData.name + ']</span>', '提示', {
            dangerouslyUseHTMLString: true,
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
                node = Object.assign({}, this.form, {'subversions': []})
              } else {
                node = this.buildNode(nodes, Object.assign({}, this.form, {'subversions': []}))
              }
              // 添加节点位置
              const index = this.addChildIndex(treeNode, isnode)
              // 判断隐藏添加根节点按钮、更新check状态
              if (treeNode === null && this.isAddRootShow) {
                this.isAddRootShow = false
                node.nocheck = true
              }
              const newNodes = zTree.addNodes(treeNode, index, node)
              if (newNodes[0].isParent) {
                // 添加多层级子节点 展开全部子节点
                zTree.expandNode(newNodes[0], true, true)
              }
              // testvalue更新 转换为=>更新map值
              this.updateMap(srcColumn, testvalue)
              // 焦点变更为添加的节点              
              const realNode = this.findRealChild(newNodes[0])
              this.handleSelect(realNode)
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
    updateNode(treeNode) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.form)
          const zTree = this.zTree
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
            this.$confirm('确认更新：<span style="color: teal">[' + treeNode.name + ']</span>', '提示', {
              dangerouslyUseHTMLString: true,
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
                // 展示详情
                this.handleSelect(treeNode)
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
            this.$confirm('确认更新：<span style="color: teal">[' + treeNode.name + ']</span>', '提示', {
              dangerouslyUseHTMLString: true,
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
                // 展示详情
                this.handleSelect(treeNode)
                this.updateMap(srcColumn, testvalue)
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
      let treeId = drawProp.treeId, treeNodes = drawProp.treeNodes, targetNode = drawProp.targetNode, moveType = drawProp.moveType
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
      }).then(_ => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        // 拖动的saveFather判断再写一个逻辑，判断targetNode是否为当前节点的父节点，inner、pre、next
        if (saveFather) {
          this.updateFatherNode(sourceNode)
        }
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

        if (this.hasSrcColumn(sourceNode)) {
          this.validateFixm()
        }
      }).catch(res => {
        if (res.code === 450) {
          this.getList()
        }
      })
    },
    // 保留父节点后续操作 => 初始化父节点 isnode、isvalid、subversions 
    updateFatherNode(treeNode) {
      const pNode = treeNode.getParentNode()
      // 通过isnode判断父节点是否有对应数据，isnode为undefined则为目录，需要初始化isnode、isvalid、subversions属性
      const isnode = pNode.isnode
      if (typeof isnode === 'undefined') {
        // 空目录
        pNode.isnode = true
        // this.$set(pNode, 'isnode', true)
        pNode.isvalid = true
        pNode.subversions = []
      }
    },
    async handleDeleteNode(treeNode1) {
      const zTree = this.zTree
      let treeNode = treeNode1
      const isParent = treeNode.isParent
      let message = '确认删除：<span style="color: teal">[' + treeNode.name + ']</span>'
      if (isParent) {
        message += '及其子节点'
      }
      await this.$confirm(message, '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async _ => {
        let saveFather = this.saveFather(treeNode)
        if (saveFather) {
          const blankFather = this.blankFather(treeNode.getParentNode())
          await this.$confirm('是否删除空白目录：<span style="color: teal">[' + blankFather.name + ']</span>', '提示', {
            dangerouslyUseHTMLString: true,
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
          if (saveFather) {
            this.updateFatherNode(treeNode)
          }
          zTree.removeNode(treeNode, false)
          // 无节点数据时 zTree.getNodes() 的值不为[],为undefined
          if (!treeNode.parentTId && !zTree.getNodes()) {
            this.isAddRootShow = true
          }
          this.handleSelect(null)
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
        if (!this.subversion) {
          this.$notify({
            title: '拖动提示',
            message: '布局已锁定！请先解锁',
            type: 'warning',
            duration: 3000,
            offset: 100
          })
        }
        return false
      } else {
        this.handleSelect(treeNodes[0])
        return true
      }
      // return this.lockType !== 'lock'
    },
    onClick(event, treeId, treeNode, clickFlag) {
      console.log('clickFlag', treeNode, clickFlag)
      if (clickFlag === 0) {
        // 不选中
        treeNode = null
      }
      this.handleSelect(treeNode)
    },
    fontCss(treeId, treeNode) {
      const isnode = treeNode.isnode
      if (treeNode.isParent) {
        return {}
      }
      if (typeof isnode === 'undefined' || isnode) {
        return { 'color': 'blue' }
      }
      return { 'color': '#32CD32' }
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
    addHoverDom(treeId, treeNode) {
      if (!this.subversion) {
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.isnode === false || $("#addBtn_"+treeNode.tId).length>0) return;
        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
          + "' title='添加子节点' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $("#addBtn_"+treeNode.tId);
        if (btn) btn.bind("click", () => {
          this.handleAdd(treeNode)
          return false
        });
      }
		},
		removeHoverDom(treeId, treeNode) {
      // if (!this.subversion) {
        $("#addBtn_"+treeNode.tId).unbind().remove();
      // }
    },
    beforeRemove(treeId, treeNode) {
      this.handleDeleteNode(treeNode)
      return false
    },
    showRemoveBtn() {
      return this.subversion === ''
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
          selectedMulti: false,
          addHoverDom: _this.addHoverDom,
          removeHoverDom: _this.removeHoverDom
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
          removeTitle: '删除节点',
          showRenameBtn: false,
          showRemoveBtn: _this.showRemoveBtn
        },
        callback: {
          beforeRemove: _this.beforeRemove,
          beforeDrag: _this.beforeDrag,
          beforeDrop: _this.beforeDrop,
          onDrop: _this.onDrop,
          onClick: _this.onClick
        },
        check: {
          enable: true,
          // 方便初始化时批量设置，后续不会起作用
          nocheckInherit: true
        }
      }
      // 初始化设置节点隐藏选择框
      treeData.forEach(data => {
        data.nocheck = true
      })
      $.fn.zTree.init($('#zTree'), setting, treeData)
      this.zTree = $.fn.zTree.getZTreeObj('zTree')
      // false 过滤不加颜色不高亮提示
      fuzzySearch('zTree', '#key', false, true) // 初始化模糊搜索方法
    }
  }
}
</script>
<style>
  .uploader-example {
    width: 90%;
    /* padding: 15px; */
    /* margin: 40px auto 0; */
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
  .page-component__scroll {
    height: 100%;
  }
  .page-component__scroll .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .ztree li span.button.add {
    margin-left:2px; 
    margin-right: 2px; 
    background-position:-144px 0; 
    vertical-align:top; 
    *vertical-align:middle
  }
  .demo-table-expand1 {
    font-size: 0;
  }
  .demo-table-expand1 label {
    color: #99a9bf;
  }
  .demo-table-expand1 .el-form-item {
    /* margin-right: 0; */
    /* margin-bottom: 0; */
    width: 100%;
  }
  .demo-table-expand1 .el-input {
    width: calc(100% - 120px);
  }
  .demo-table-expand1 .el-textarea {
    width: calc(100% - 120px);
  }
  .demo-table-expand1 .el-input-number {
    width: calc(100% - 120px);
  }
  .demo-table-expand1 .el-input-number .el-input {
    width: 100%;
  }
  .demo-table-expand1 .aspan {
    width: calc(100% - 120px);
    min-height: 36px;
    line-height: 36px;
    border: dotted 1px #d7dae2;
    border-radius: 5px;
    /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
    padding: 0 15px;
    font-family: sans-serif;
    white-space: pre-line;
    word-break:break-all;
  }
  .ztree * {
    font-size: 14px
  }
</style>
<style scoped>
</style>