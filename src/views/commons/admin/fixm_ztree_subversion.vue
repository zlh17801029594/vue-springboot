<template>
  <el-container>
    <el-col :span="12" style="margin-right: 8px;">
      <el-card>
          <div style="height: calc(100vh - 126px);">
          <ul id="zTree" class="ztree" />
          </div>
      </el-card>
    </el-col>
    <el-col>
      <div class="app-container">
        <el-table :data="tableData" border>
          <el-table-column prop="xsdnode" label="xsdnode" />
          <el-table-column label="是否节点">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isnode ? 'success' : 'danger'">
                {{ scope.row.isnode ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="version" label="版本" />
          <el-table-column prop="subversion" label="子版本" />
        </el-table>
        <div style="margin-top: 20px;" />
        <el-button @click="handleHideAll">HideAll</el-button>
        <el-button type="success" @click="handleShowAll">ShowAll</el-button>
        <el-button type="primary" @click="handle('A')">A</el-button>
        <el-button type="primary" @click="handle('B')">B</el-button>
        <el-button type="primary" @click="handle('C')">C</el-button>
        <el-button type="primary" @click="handle('D')">D</el-button>
      </div>
    </el-col>
  </el-container>
</template>
<script>
const split_sign = '->'
export default {
  name: 'FixmPanel1',
  data() {
    return {
      tableData: [
        {xsdnode: 'x->y->i', isnode: true, version: 'core4.1'},
        {xsdnode: 'x->y->j', isnode: true, version: 'core4.1', subversion: 'A,B,C,D'},
        {xsdnode: 'x->y->z', isnode: true, version: 'core4.1', subversion: 'A,B'},
        {xsdnode: 'x->y->k', isnode: true, version: 'core4.1', subversion: 'A,C'},
        {xsdnode: 'x->y->k->s', isnode: true, version: 'core4.1', subversion: 'D'}        
      ],
      treeData: [
        {
          name: 'x',
          children: [{
            name: 'y',
            children: [{
              name: 'i',
              isnode: true,
              version: 'core4.1'
            },{
              name: 'j',
              isnode: true,
              version: 'core4.1',
              subversion: ['A', 'B', 'C', 'D']
            },{
              name: 'z',
              isnode: true,
              version: 'core4.1',
              subversion: ['A', 'B']
            },{
              name: 'k',
              isnode: true,
              version: 'core4.1',
              subversion: ['A', 'C'],
              children: [{
                name: 's',
                isnode: true,
                version: 'core4.1',
                subversion: ['D']
              }]
            }]
          }]
        }
      ],
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
      zTree: null
    }
  },
  // created 和 mounted区别很大[时机不同]
  // 此处用created树节点不会显示
  // 用mounted会展示
  mounted() {
    this.initTree()
  },
  methods: {
    filter(node, two) {
      return (node.subversion && node.subversion.indexOf(two) !== -1)
    },
    handleHideAll(){
      const rootNodes = this.zTree.getNodes()
      const showNodes = this.zTree.getNodesByParam('isHidden', false)
      this.zTree.hideNodes(showNodes)
    },
    handleShowAll(){
      const rootNodes = this.zTree.getNodes()
      const hideNodes = this.zTree.getNodesByParam('isHidden', true)
      this.zTree.showNodes(hideNodes)
    },
    handle(two){
      // 隐藏所有
      this.handleHideAll()
      // 展示所需
      const dNodes = this.zTree.getNodesByFilter(this.filter, false, null, two)
      if (dNodes) {
        dNodes.forEach(node => {
          this.zTree.showNodes(node.getPath())
        })
      }
    },
    fontCss(treeId, treeNode) {
      const isNode = treeNode.isnode
      if (treeNode.isParent) {
        return {}
      }
      if (typeof isNode === 'undefined' || isNode) {
        return { 'color': 'blue' }
      }
      return { 'color': '#32CD32' }
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
          fontCss: _this.fontCss,
          selectedMulti: false
        },
        edit: {
          drag: {
            isCopy: false,
            isMove: true
          },
          enable: true,
          showRenameBtn: false,
          showRemoveBtn: false
        },
        callback: {
          
        }
      }
      console.log('treeData', _this.treeData)
      $.fn.zTree.init($('#zTree'), setting, _this.treeData)
      this.zTree = $.fn.zTree.getZTreeObj('zTree')
      this.zTree.expandAll(true)
    }
  }
}
</script>
<style>
  /* .ztree * {
    font-size: 20px
  } */
</style>
<style scoped>
</style>