<template>
  <div class="app-container">
    <!-- <el-button type="primary" :hidden="true">新增</el-button> -->
    <el-table
    :data="tableData"
    :span-method="arraySpanMethod"
    row-key="id"
    border
    :row-class-name="tableRowClassName"
    style="width: 100%">
        <el-table-column
        prop="id"
        label="id"
        width="200">
        </el-table-column>
        <el-table-column
        prop="name"
        label="服务/接口名称">
        </el-table-column>
        <el-table-column
        label="接口url">
          <template slot-scope="scope">
            <el-button @click="info(scope.row)" type="text">{{scope.row.url}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
        prop="sensitive"
        label="敏感级别">
        </el-table-column>
        <el-table-column
        prop="status"
        label="状态"
        :formatter="show"
        :filters="[{ text: '已启用', value: 1 }, { text: '已停用', value: 2 }]"
        :filter-method="filterStatus"
        filter-placement="bottom-end">
        </el-table-column>
        <el-table-column
        label="操作"
        width="230">
        <template slot-scope="scope">
            <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
            <el-button @click="handleClick(scope.row)" type="primary" size="small">编辑</el-button>
            <el-button type="primary" size="small" v-show="on(scope.row)">启用</el-button>
            <el-button type="danger" size="small" v-show="off(scope.row)">停用</el-button>
        </template>
        </el-table-column>
    </el-table>
    <el-dialog
        :visible.sync="drawer"
        :before-close="closeDrawer"
        ref="drawer"
        :center="true">
        <el-form :model="ruleForm" ref="ruleForm" label-position="left" label-width="80px" style="padding-left: 1%" v-show="show1">
          <el-form-item label="接口名称" prop="name">
            <el-col :span="6">
              <el-input v-model="ruleForm.name" :disabled="true"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="接口url" prop="url">
            <el-col :span="6">
              <el-input v-model="ruleForm.url" :disabled="true"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="敏感级别" prop="prop">
            <el-select v-model="ruleForm.icon" placeholder="请选择对应敏感级别" style="width: 200px;">
              <el-option label="0" value="0"></el-option>
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
              <el-option label="3" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">确定</el-button>
          </el-form-item>
        </el-form>
        <apiInfo v-show="show2" />
      </el-dialog>
  </div>
</template>
<script>
import apiInfo from './api-info-view'
export default {
    components: {
      apiInfo
    },
    methods: {
      filterStatus(value, row){
          if(row.children){
              return row.children.some(e => {
                  return e.status === value
              })
          }else{
              if(row.status === value){
                  return true
              }
          }
          return false
          
      },
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (row.children) {
          if (column.label === '服务/接口名称') {
            return [1, 3];
          } else if (column.label === '接口url') {
            return [0, 0];
          } else if (column.label === '敏感级别'){
            return [0, 0]
          }
        }
      },
      handleClick(row) {
        this.drawer = true
        this.show1 = true
        this.show2 = false
        console.log(row);
      },
      closeDrawer(done){
        done()
        this.$refs['ruleForm'].resetFields()
        this.isEdit = false
      },
      on(row){
        if(row.children){
            let flag = row.children.some(e => {
                return e.status === 2
            })
            if(flag){
                return true
            }
        }
        if(row.status === 2){
            return true
        }else{
            return false
        }
      },
      off(row){
        if(row.children){
            let flag = row.children.some(e => {
                return e.status === 1
            })
            if(flag){
                return true
            }
        }else{
            if(row.status === 1){
                return true
            }else{
                return false
            }
        }
      },
      show(row, col, status) {
          if(row.children){
            let arr = row.children
            let b=0,c=0
            arr.forEach(element => {
                if(element.status === 1){
                    b++
                }else if(element.status === 2){
                    c++
                }
            });
            return '已启用'+b+'、已停用'+c
          }else{
            if(status === 1){
                return '已启用'
            }else if(status === 2){
                return '已停用'
            }else{
                return '已停用'
            }
          }
      },
      tableRowClassName({row, rowIndex}) {
        if(!row.children){
          if (row.status === 2) {
            return 'off-row';
          }
        }
        return '';
      },
      info(row){
        this.drawer = true
        this.show1 = false
        this.show2 = true
      }
    },

    data() {
      return {
        tableData: [{
          id: 1,
          name: 'FlightInfo航班信息服务 API',
          url: '',
          sensitive: 0,
          status: 1,
          children: [{
              id: 3,
              name: '关舱门超时分钟数',
              url: '/gateway/flightinfo-service/flightinfo/getCloseDoorOverTimMinutes',
              sensitive: 0,
              status: 1
            },{
              id: 4,
              name: 'api2',
              url: '/gateway/flightinfo-service/api2',
              sensitive: 0,
              status: 2
            }]
        }, {
          id: 5,
          name: 'FDEXM飞行数据交换信息服务 AP',
          url: '',
          sensitive: 0,
          status: 1,
          children: [{
              id: 7,
              name: '关舱门超时分钟数',
              url: '/gateway/fdexm-service/fdexm/get',
              sensitive: 0,
              status: 1
            },{
              id: 8,
              name: 'api3',
              url: '/gateway/fdexm-service/api3',
              sensitive: 0,
              status: 1
            }]
        }, {
          id: 9,
          name: '气象信息服务 AP',
          url: '',
          sensitive: 0,
          status: 2,
          children: [{
              id: 11,
              name: '天气信息',
              url: '/gateway/weather-service/weather/get',
              sensitive: 0,
              status: 2
            },{
              id: 12,
              name: 'api4',
              url: '/gateway/weather-service/api4',
              sensitive: 0,
              status: 2
            }]
          }],
        ruleForm: {
          name: '航班信息',
          url: '/flightinfo/getflightinfo',
          icon: '0'
        },
        drawer: false,
        show1: false,
        show2: false
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

  .el-table .on-row {
    background: #9ecf84;
  }
  .el-table .off-row {
    background: #d39e97;
  }
</style>