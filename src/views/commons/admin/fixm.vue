<template>
  <div class="app-container">
    <div class="tree-container">
      <el-tree
        ref="tree"
        class="tree"
        :indent="0"
        :data="treeData"
        default-expand-all
        node-key="id"
        highlight-current
        :expand-on-click-node="false"
        @node-click="handleClick"
      >
        <span slot-scope="{node, data}" class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span />
        </span>
      </el-tree>
    </div>
  </div>
</template>
<script>
import { getFixm } from '@/api/fixm'
export default {
  data() {
    return {
      treeData: []
    }
  },
  created() {
    this.getList1()
  },
  methods: {
    getList1() {
      getFixm().then(response => {
        this.treeData = response.data
      })
    },
    handleClick(data, node, _this) {
      console.log(data, node, _this)
    }
  }
}
</script>
<style>
  .tree /deep/ .el-tree-node {
    position: relative;
    /* padding-left: 16px; */
  }
  .tree /deep/ .el-tree-node__children {
    padding-left: 32px;
  }
  .tree /deep/ .el-tree-node :last-child:before {
    height: 38px;
  }
  .tree /deep/ .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .tree-container /deep/ .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .tree-container /deep/ .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .tree /deep/ .el-tree-node:before {
    content: "";
    left: -20px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree /deep/ .el-tree-node:after {
    content: "";
    left: -20px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree /deep/ .el-tree-node:before {
    border-left: 1px dashed #4386c6;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 20px;
  }
  .tree /deep/ .el-tree-node:after {
    border-top: 1px dashed #4386c6;
    height: 20px;
    top: 12px;
    width: 24px;
  }
</style>
