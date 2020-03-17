<template>
  <div class="app-container">
    <el-tree
      ref="tree"
      :data="data"
      show-checkbox
      default-expand-all
      node-key="id"
      highlight-current
      :expand-on-click-node="false"
      :props="defaultProps"
      :render-content="renderContent">
    </el-tree>
  </div>
</template>

<script>
  import {getService} from '@/api/user'
  export default {
    name: "services-panel",
    data() {
      return {
        data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      renderContent(h, {node, data, store}) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            {
              node.level == 3 ? <span>{data.uri}</span> : null
            }
          </span>
        )
      }
    },
    created() {
      getService().then(response => {
        console.log(response)
        this.data = response.data
      })
    }
  }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
