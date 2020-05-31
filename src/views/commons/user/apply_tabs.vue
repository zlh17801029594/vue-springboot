<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <tab-pane v-if="activeName==item.key" :type="item.key" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tabPane from './apply_panel'

export default {
  components: { tabPane },
  data() {
    return {
      tabMapOptions: [
        { label: '待审批', key: 'approve' },
        { label: '全部通过', key: 'pass' },
        { label: '部分通过', key: 'passSome' },
        { label: '未通过', key: 'deny' },
        { label: '已过期', key: 'expire' },
        { label: '已失效', key: 'disabled' }
      ],
      activeName: 'approve'
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .tab-container {
    margin: 20px;
  }
</style>
