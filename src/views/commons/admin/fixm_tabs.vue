<template>
  <div class="tab-container">
    <div>
      <!-- 添加版本不能同名 -->
      <el-button
        type="primary"
        @click="addVersion()"
        style="margin: 0;"
        >
        添加版本
      </el-button>
      <!-- 无节点，不能删除 -->
      <el-button
        type="danger"
        :disabled="!(tabMapOptions && tabMapOptions.length)"
        @click="removeVersion(activeName)"
        style="margin: 0;"
        >
        删除版本
      </el-button>
      <!-- <el-form label-position="left" label-width="100px">
        <el-form-item label="验证文件">
          <el-select v-model="validateFile" placeholder="请选择验证文件" clearable style="width: 130px; margin: 0">
            <el-option v-for="item in validateFiles" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form> -->
    </div>
    <!-- stretch:支撑开(平均宽度) -->
    <el-tabs v-model="activeName" style="margin-top:15px;" type="card" tab-position="left">
      <el-tab-pane v-for="(item, index) in tabMapOptions" :key="item" :label="item" :name="item">
        <fixm-panel v-if="activeName==item" :version="item" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import fixmPanel from './fixm_ztree'
import { fixmVersions, delFixmByVersion, keys, map } from '@/api/fixm'
export default {
  components: { fixmPanel },
  data() {
    return {
      tabMapOptions: [],
      activeName: '',
      validateFiles: [{
        key: '/a/b.xsd',
        label: '/a/b'
      }, {
        key: '/c/d.xsd',
        label: '/c/d'
      }],
      validateFile: ''
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    this.fixmVersions()
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    fixmVersions() {
      fixmVersions().then(response => {
        this.tabMapOptions = response.data
        if (this.tabMapOptions && this.tabMapOptions.length) {
          this.activeName = this.tabMapOptions[0]
        }
      })
    },
    addVersion() {
      this.$prompt('请输入版本名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (value) => {
          if (!value) {
            return '版本名不能为空!'
          }
          if (this.tabMapOptions.indexOf(value) !== -1) {
            return '版本名重复!'
          }
          return true
        }
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '操作成功'
        });
        let newTabName = value;
        this.tabMapOptions.push(newTabName);
        this.activeName = newTabName;
      }).catch(() => {
      });
    },
    removeVersion(targetName) {
      this.$confirm('确认删除版本：' + targetName, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        delFixmByVersion(targetName).then(_ => {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          let tabs = this.tabMapOptions;
          let activeNameTemp = this.activeName;
          if (activeNameTemp === targetName) {
            tabs.some((tab, index) => {
              if (tab === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeNameTemp = nextTab;
                }
                return true
              }
            });
          }
          this.activeName = activeNameTemp;
          this.tabMapOptions = tabs.filter(tab => tab !== targetName);
        })
      })
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
</style>
