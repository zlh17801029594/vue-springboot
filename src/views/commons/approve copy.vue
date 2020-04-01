<template>
  <div class="app-container">
    <el-table
    :data="tableData"
    :row-class-name="tableRowClassName"
    border
    style="width: 100%">
        <el-table-column
        fixed
        prop="date"
        label="申请时间"
        width="200">
        </el-table-column>
        <el-table-column
        prop="name"
        label="用户">
        </el-table-column>
        <el-table-column
        label="接口详情">
            <template slot-scope="scope">
                <el-button @click="info(scope.row)" type="text" >{{scope.row.url}}</el-button>
            </template>
        </el-table-column>
        <el-table-column
        prop="endTime"
        label="申请时长">
        </el-table-column>
        <el-table-column
        prop="status"
        label="状态"
        :formatter="show">
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        width="220">
        <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
            <el-button @click="handleClick(scope.row)" type="primary" size="small" :style="{display: isShow(scope.row)}">审核</el-button>
            <el-button type="danger" size="small">删除</el-button>
        </template>
        </el-table-column>
    </el-table>
    <el-dialog
        :visible.sync="drawer"
        :before-close="closeDrawer"
        ref="drawer"
        :center="true"
        width="550px">
        <tree :treeData="treeData" :selectedData="selectedData" />
    </el-dialog>
  </div>
</template>
<script>
import tree from "./micro-service-tree";
export default {
    components: {
        tree
    },
    methods: {
      closeDrawer(done){
        done()
      },
      handleClick(row) {
        console.log(row);
      },
      info(row){
          this.drawer = true
      },
      isShow(row) {
        if(row.status === 0){
            return ''
        }else {
            return 'none'
        }
      },
      show(row, col, i) {
          if(i === 0){
              return '未审核'
          }else if(i === 1){
              return '通过'
          }else{
              return '未通过'
          }
      },
      tableRowClassName({row, rowIndex}) {
        if (row.status === -1) {
          return 'warning-row';
        } else if (row.status === 1) {
          return 'success-row';
        }
        return '';
      }
    },

    data() {
      return {
        tableData: [{
          date: '2019-05-02 09:10:55',
          name: '张三',
          url: '/flightinfo,/fdexm',
          endTime: '30 days',
          status: 0
        }, {
          date: '2019-05-04 09:10:55',
          name: '李四',
          url: '/flightinfo,/fdexm',
          endTime: '10 days',
          status: -1
        }, {
          date: '2019-05-01 09:10:55',
          name: '王五',
          url: '/flightinfo,/fdexm',
          endTime: '20 days',
          status: 1
        }, {
          date: '2019-05-03 09:10:55',
          name: '赵六',
          url: '/flightinfo,/fdexm',
          endTime: '60 hours',
          status: 1
        }],
        treeData: [{
            id: 1,
            label: 'Flightinfo信息服务',
            children: [{
                id: 2,
                label: '关舱门时间'
            },{
                id: 3,
                label: '开舱门时间'
            }]
        },{
            id: 4,
            label: 'Fdexm信息服务',
            children: [{
                id: 5,
                label: '接口1'
            },{
                id: 6,
                label: '接口2'
            }]
        }],
        selectedData: [2, 5],
        drawer: false
      }
    }
}
</script>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>