<template>
  <div class="app-container">
    <el-button type="primary">新增</el-button>
    <el-table
    :data="tableData"
    border
    style="width: 100%">
        <el-table-column
        prop="id"
        label="#"
        width="80">
        </el-table-column>
        <el-table-column
        prop="name"
        label="接口名称">
        </el-table-column>
        <el-table-column
        prop="url"
        label="接口url">
        </el-table-column>
        <el-table-column
        prop="prop"
        label="权限标识">
        </el-table-column>
        <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">删除</el-button>
        </template>
        </el-table-column>
    </el-table>
    <el-dialog
        :visible.sync="drawer"
        :before-close="closeDrawer"
        ref="drawer"
        :center="true"
        width="550px">
        <el-form :model="ruleForm" ref="ruleForm" label-position="left" label-width="80px" style="padding-left: 1%">
          <el-form-item label="接口名称" prop="name">
            <el-col :span="6">
              <el-input v-model="ruleForm.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="接口url" prop="url">
            <el-col :span="6">
              <el-input v-model="ruleForm.url"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="权限标识" prop="prop">
            <el-select v-model="ruleForm.icon" placeholder="请选择对应权限" style="width: 200px;">
              <el-option label="flightinfo_read" value="flightinfo_read"></el-option>
              <el-option label="菜单" value="tree-table"></el-option>
              <el-option label="表格" value="table"></el-option>
              <el-option label="文本" value="list"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
  </div>
</template>
<script>
export default {
    methods: {
      handleClick(row) {
        this.drawer = true
        console.log(row);
      },
      closeDrawer(done){
        done()
        this.$refs['ruleForm'].resetFields()
        this.isEdit = false
      },
    },

    data() {
      return {
        tableData: [{
          id: '1',
          name: '航班信息',
          url: '/flightinfo/getflightinfo',
          prop: 'flightinfo_read'
        }, {
          id: '2',
          name: '关舱门超时分钟数',
          url: '/flightinfo/getCloseDoorMinites',
          prop: 'flightcloseminite_read'
        }, {
          id: '3',
          name: 'FDEXM信息',
          url: '/fdexm/getinfo',
          prop: 'fdexminfo_read'
        }, {
          id: '4',
          name: '机场信息',
          url: '/airport/getinfo',
          prop: 'airportinfo_read'
        }],
        ruleForm: {
          name: '航班信息',
          url: '/flightinfo/getflightinfo',
          prop: 'flightinfo_read'
        },
        drawer: false
      }
    }
}
</script>