<template>
  <div class="app-container">
    <el-container style="height: calc(100vh - 124px);">
      <el-aside style="width: 35%; padding: 0; margin: 0; background: #FFF;">
        <el-header align="left" style="height: 40px; padding: 0">
          <el-input id="key" v-model="key" placeholder="请输入关键字" prefix-icon="el-icon-search" />
        </el-header>
        <el-main style="height: calc(100vh - 164px); padding: 0">
          <ul id="ztree" class="ztree" />
        </el-main>
      </el-aside>
      <el-main style="padding: 0 20px">
        <el-form v-show="isLeaf" ref="form" :model="form" label-position="left" label-width="120px">
          <el-form-item label="数据源字段">
            <el-col :span="8">
              <el-input v-model="form.srcColumn" />
            </el-col>
          </el-form-item>
          <el-form-item label="节点/属性">
            <el-col :span="8">
              <el-select v-model="form.isnode">
                <el-option label="node" :value="true" />
                <el-option label="property" :value="false" />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="字段解释">
            <el-col :span="8">
              <el-input v-model="form.explain" />
            </el-col>
          </el-form-item>
          <el-form-item label="测试值">
            <el-col :span="8">
              <el-input v-model="form.testvalue" />
            </el-col>
          </el-form-item>
          <el-form-item label="是否生效">
            <el-switch v-model="form.isvalid" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">更新</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>
<script>
//  style="height: calc(100vh - 124px);"
import { getFixm, updateFixmLeaf, updateFixmNoLeafLabel, delFixm } from '@/api/fixm'
export default {
  data() {
    return {
      treeData: [],
      key: undefined,
      form: {
        name: '',
        srcColumn: '',
        isnode: false,
        explain: '',
        testvalue: '',
        isvalid: false
      },
      isLeaf: false
    }
  },
  created() {
    this.getList1()
  },
  methods: {
    getList1() {
      getFixm().then(response => {
        this.treeData = response.data
        this.initTree()
      })
    },
    initTree() {
      const _this = this
      const setting = {
        data: {
          key: {
            name: 'label'
          },
          keep: {
            leaf: true,
            parent: true
          }
        },
        view: {

        },
        edit: {
          enable: true,
          editNameSelectAll: true
        },
        callback: {
          beforeRemove: beforeRemove,
          beforeRename: beforeRename,
          beforeClick: beforeClick
        }
      }
      function beforeRemove(treeId, treeNode) {
        const zTree = $.fn.zTree.getZTreeObj(treeId)
        zTree.selectNode(treeNode)
        const flag = confirm('确认删除 节点 -- ' + treeNode.label + ' 吗？')
        if (flag) {
          let ids
          if (treeNode.isParent) {
            const nodes = zTree.getNodesByParam('isParent', false, treeNode)
            ids = nodes.map(node => node.id)
          } else {
            ids = [treeNode.id]
          }
          delFixm(ids)
        }
        return flag
      }
      function beforeRename(treeId, treeNode, newName, isCancel) {
        const zTree = $.fn.zTree.getZTreeObj(treeId)
        if (newName.length === 0) {
          setTimeout(function() {
            zTree.cancelEditName()
            alert('节点名称不能为空.')
          }, 0)
          return false
        }
        if (treeNode.isParent) {
          const nodes = zTree.getNodesByParam('isParent', false, treeNode)
          const ids = nodes.map(node => node.id)
          const level = treeNode.level
          const label = newName
          updateFixmNoLeafLabel({
            level: level,
            label: label,
            ids: ids
          })
        } else {
          const node = treeNode
          updateFixmLeaf(node.id, {
            label: newName
          })
        }
        return true
      }
      function beforeClick(treeId, treeNode, clickFlag) {
        _this.isLeaf = !treeNode.isParent
        if (_this.isLeaf) {
          _this.form = Object.assign({}, treeNode)
        }
        return true
      }

      const zNodes = _this.treeData
      $.fn.zTree.init($('#ztree'), setting, zNodes)
      const ztree = $.fn.zTree.getZTreeObj('ztree')
      ztree.expandAll(true)
      fuzzySearch('ztree', '#key', null, true) // 初始化模糊搜索方法
      console.log(ztree.getNodes())
    }
  }
}
</script>
