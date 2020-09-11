<template>
  <div class="tab-container menudiv" style="height: calc(100vh - 124px); display: flex;">
    <div style="margin-right: 8px;">
      <div style="height: 40px;">
        <!-- 添加版本不能同名 -->
        <el-button
          type="success"
          icon="el-icon-plus"
          @click="addVersion()"
          style="margin: 0;"
          >添加版本</el-button>
      </div>
      <el-tree
        :data="treeData"
        ref="tree"
        node-key="id"
        style="width: 200px;"
        :indent="8"
        :expand-on-click-node="false"
        :default-expanded-keys="keys"
        @node-click="handleClick"
        highlight-current>
        <span class="custom" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              style="margin: 0;"
              v-show="node.level === 1"
              @click.stop="() => append(node, data)">
              <i class="el-icon-plus" style="color: #67C23A;" />
            </el-button>
            <el-button
              type="text"
              size="mini"
              style="margin: 0;"
              @click.stop="() => remove(node, data)">
              <i class="el-icon-minus" style="color: #F56C6C;" />
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <div style="width: 100%;">
      <div v-for="(item) in treeData" :key="item.id">
        <fixm-panel v-if="version == item.label" :version="item.label" :subversion="subversion" />
      </div>
    </div>
  </div>
</template>

<script>
import fixmPanel from './fixm_ztree'
import { fixmVersions, delFixmByVersion, keys, map, fixmSubversions, delSubversion } from '@/api/fixm'
export default {
  components: { fixmPanel },
  data() {
    return {
      currentNode: null,
      version: '',
      subversion: '',
      treeData: [],
      idMax: 0,
      keys: []
    }
  },
  watch: {
    
  },
  mounted() {
    this.fixmVersions()
  },
  methods: {
    currentNodeHandler(val, old) {
      console.log('watcher', val, old)
      if (val) {
        if (val.level === 1) {
          const version = val.data.label
          this.version = version
          this.subversion = ''
          this.$router.push(`${this.$route.path}?version=${version}`)
        } else if (val.level === 2) {
          const version = val.parent.data.label
          const subversion = val.data.label
          this.version = version
          this.subversion = subversion
          this.$router.push(`${this.$route.path}?version=${version}&subversion=${subversion}`)
        }
      }
    },
    fixmVersions() {
      fixmSubversions().then(response => {
        const versionData = response.data
        const treeData = []
        versionData.forEach(version => {
          const node = {
            id: this.idMax,
            label: version.name
          }
          this.idMax++
          if (typeof version.subversions !== 'undefined') {
            const children = []
            version.subversions.forEach(subversion => {
              const childNode = {
                id: this.idMax,
                label: subversion
              }
              this.idMax++
              children.push(childNode)
            })
            this.$set(node, 'children', children)
          }
          treeData.push(node)
        });
        this.treeData = treeData

        let currentData
        if (this.treeData && this.treeData.length) {
          const version = this.$route.query.version
          const subversion = this.$route.query.subversion
          if (version) {
            for (const v of this.treeData) {
              if (v.label === version) {
                this.version = version
                currentData = v
                // 只有主版本正确、才加载子版本
                // 满足1.路由中含有子版本，2.主版本含有子版本
                if (subversion && v.children && v.children.length) {
                  for (const k of v.children) {
                    if (k.label === subversion) {
                      this.subversion = subversion
                      currentData = k
                      break
                    }
                  }
                }
                break
              }
            }
            if (!this.version) {
              this.version = this.treeData[0].label
              currentData = this.treeData[0]
            }
          } else {
            this.version = this.treeData[0].label
            currentData = this.treeData[0]
          }
          this.$nextTick(() => {
            this.currentNode = this.$refs['tree'].getNode(currentData)
            this.$refs['tree'].setCurrentKey(this.currentNode.data.id)
            // 路由定位到子模板，需要展开父节点
            if (this.currentNode.level > 1) {
              this.keys.push(this.currentNode.parent.data.id)
            }
            
          })
        }
        // 当一开始无版本时，需要在此处使用监听
        this.$watch('currentNode', this.currentNodeHandler)
      })
    },
    addVersion() {
      this.$prompt('请输入版本名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (value) => {
          if (!value) {
            return '名称不能为空!'
          }
          if (this.treeData.map(e => e.label).indexOf(value) !== -1) {
            return '版本名重复!'
          }
          return true
        }
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '操作成功'
        });
        const rootData = {
          id: this.idMax,
          label: value
        }
        this.idMax++
        this.$refs['tree'].append(rootData, null)
        this.currentNode = this.$refs['tree'].getNode(rootData.id)
        this.$refs['tree'].setCurrentKey(rootData.id)
      }).catch(() => {
      });
    },
    handleClick(data, node) {
      console.log(this.treeData, data, node)
      this.currentNode = node
      // if (node.level > 1) {
      //   this.subversion = data.label
      // } else {
      //   this.subversion = ''
      // }
    },
    append(node, data) {
      this.$prompt('请输入子模板名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (value) => {
          if (!value) {
            return '名称不能为空!'
          }
          if (data.children && data.children.map(e => e.label).indexOf(value.trim()) !== -1) {
            return '子模板名重复!'
          }
          return true
        }
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '操作成功'
        });
        const childData = {
          id: this.idMax,
          label: value
        }
        this.idMax++
        this.$refs['tree'].append(childData, node)
        this.currentNode = this.$refs['tree'].getNode(childData.id)
        this.$refs['tree'].setCurrentKey(childData.id)
      }).catch(() => {
      });
    },
    remove(node, data) {
      const name = data.label
      if (node.level > 1) {
        // 删除子模板
        const pNode = node.parent
        const version = pNode.label
        this.$confirm('确认删除子模板配置信息：' + name, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          delSubversion(version, name).then(_ => {
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.$refs['tree'].remove(data)
          })
        }).catch(() => {})
      } else {
        // 删除版本
        this.$confirm('确认删除当前版本所有数据：' + name, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          delFixmByVersion(name).then(_ => {
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.$refs['tree'].remove(data)
          })
        }).catch(() => {})
      }
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 20px;
  }
</style>
<style>
  .el-tabs__item.is-active {
    background-color: #68a7e6;
    color: aliceblue
  }
  .el-tree-node.is-current {
    /* background-color: #68a7e6; */
    /* color: aliceblue */
  }
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    /* background-color: #edf6ff; */
    background-color: #68a7e6;
    color: aliceblue;
  }
  .menudiv .el-tree {
    border: 1px solid #e4e7ed;
    border-top: none;
    border-radius: 4px 4px 0 0;
  }
  .menudiv .el-tree .el-tree-node__content {
    border-top: 1px solid #e4e7ed;
    height: 40px;
  }
  /* .menudiv .el-tree .el-tree-node__content:first-child {
    border-top: none;
  } */
  .custom {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
