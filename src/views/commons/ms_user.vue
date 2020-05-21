<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      v-loading="loading"
      element-loading-text="加载中..."
      border
      highlight-current-row
      :indent="0"
      style="width: 100%"
    >
      <el-table-column label="#" type="index" :index="1" />
      <el-table-column prop="username" label="用户名" align="center" min-width="180" />
      <el-table-column prop="sensitiveNum" label="用户敏感级别" align="center" min-width="200" />
      <el-table-column fixed="right" label="操作" align="center" width="300">
        <template slot-scope="scope">
          <router-link :to="'/ms_user/editUserApi'">
            <el-button
              type="primary"
              size="small"
            >管理用户接口</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import {getAllUser} from '@/api/ms_user'
import pagination from '@/components/Pagination'
export default {
  components: {
    pagination
  },
  data() {
    return {
      tableData: [],
      loading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  inject: ['reload'],
  created() {
    this.getList()
  },
  methods: {
    async getList(){
      this.loading = true
      await getAllUser(this.listQuery).then(response => {
        this.tableData = response.data.list
        this.total = response.data.total
      }).catch(_ => {
      })
      this.loading = false
    },
  }
}
</script>
<style>

</style>
