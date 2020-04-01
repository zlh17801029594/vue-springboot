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
      :props="defaultProps">
      <span class="custom-tree-node" slot-scope="{node, data}">
        <span>{{node.label}}</span>
        <span>
          
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
  import {getService} from '@/api/user'
  import {getToken} from '@/utils/auth'

  export default {
    name: "services-panel-tree",
    data() {
      return {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {

    },
    created() {
      getService(getToken()).then(response => {
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
