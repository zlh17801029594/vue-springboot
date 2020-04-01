<template>
  <div class="app-container">
    <el-table
    :data="tableData"
    :span-method="arraySpanMethod"
    row-key="id"
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
        <!-- <el-table-column
        label="接口详情">
            <template slot-scope="scope">
                <el-button @click="info(scope.row)" type="text" >{{scope.row.url}}</el-button>
            </template>
        </el-table-column> -->
        <el-table-column
        label="接口url">
          <template slot-scope="scope">
            <el-button @click="info(scope.row)" type="text">{{scope.row.url}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
        prop="endTime"
        label="到期时间">
        </el-table-column>
        <el-table-column
        prop="status"
        label="状态"
        :formatter="show"
        :filters="[{ text: '待审批', value: 0 }, { text: '已启用', value: 1 }, { text: '已停用', value: 2 }, { text: '未通过', value: -1 }]"
        :filter-method="filterStatus"
        filter-placement="bottom-end"
        >
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        width="300">
        <template slot-scope="scope">
            <el-button @click="common(scope.row)" type="primary" size="small">查看</el-button>
            <el-button @click="common(scope.row, 0)" type="primary" size="small" v-show="isShow(scope.row)">审批</el-button>
            <el-button @click="common(scope.row, 2)" type="primary" size="small" v-show="on(scope.row)">启用</el-button>
            <el-button @click="common(scope.row, 1)" type="danger" size="small" v-show="off(scope.row)">停用</el-button>
        </template>
        </el-table-column>
    </el-table>
    <el-dialog
        :visible.sync="dialog"
        :before-close="closeDialog"
        ref="dialog"
        :center="true">
        <!-- <tree :selectedData="selectedData" :filterArr="filterArr" v-if="show1" />
        <apiInfo v-else /> -->
        <tree ref="tree" :filterArr="filterArr" :checkbox="checkbox" />
        <span slot="footer" >
            <el-button @click="dialog=false" type="primary" size="small">取消</el-button>
            <el-button @click="submit(2)" type="primary" size="small" v-show="dialogBuSh(2)">启用</el-button>
            <el-button @click="submit(1)" type="primary" size="small" v-show="dialogBuSh(1)">停用</el-button>            
        </span>
    </el-dialog>
  </div>
</template>
<script>
import tree from "./micro-service-tree";
import apiInfo from './api-info-view'
export default {
    components: {
        tree, apiInfo
    },
    methods: {
      submit(i){
          let ids = this.$refs.tree.getIds()
          console.log(ids)
          let dataNodes = []
          if(ids){
              this.findItem(this.tableData, item=>{
                  return ids.indexOf(item.id) !== -1
              }, dataNodes)
              if(i === 0){
                  dataNodes.forEach(e=>{
                      e.status = 1
                  })
              }else if(i === 1){
                  dataNodes.forEach(e=>{
                      e.status = 2
                  })

              }else if(i === 2){
                  dataNodes.forEach(e=>{
                      e.status = 1
                  })
              }
              this.dialog = false
          }else{
              this.$alert('不能为空！')
          }
          console.log(dataNodes)
      },
      findItem(arr, fn, dataNodes){
          if(arr instanceof Array){
              arr.forEach(item => {
              if(item.children){
                  this.findItem(item.children, fn, dataNodes)
              }else{
                  if(fn(item)){
                      dataNodes.push(item)
                  }
              }
          })
          }
          
      },
      dialogBuSh(i){
          if(i === this.viewStatus){
              return true
          }else{
              return false
          }
      },
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
          if (column.label === '用户') {
            return [1, 3];
          } else if (column.label === '接口url') {
            return [0, 0];
          } else if(column.label === '到期时间'){
            return [0,0]
          }
        }
      },
      closeDialog(done){
        done()
      },
      common(row, status){
          let idStatus = []
          if(row.children){
              let childrenArr = row.children
              if(typeof status !== 'undefined'){
                  childrenArr = childrenArr.filter(e=>{
                      return e.status === status
                  })
              }
              idStatus = childrenArr.map(e=>{
                  return {id:e.id, status:e.status}
              })
          }else{
              // 单条数据不展示树结构
              if(typeof status !== 'undefined'){
                let dataNode = []
                this.findItem(this.tableData, item=>{
                    return item.id === row.id
                }, dataNode)
                if(status === 0){
                    this.$confirm('审批','提示',{
                        distinguishCancelAndClose: true,
                        confirmButtonText: '通过',
                        cancelButtonText: '拒绝',
                        type: 'info',
                        center: 'true'
                    }).then(_ => {
                        dataNode[0].status = 1
                    }).catch(action => {
                        if(action === 'cancel'){
                            dataNode[0].status = -1
                        }
                    });
                }else if(status === 1){
                    this.$confirm('停用','提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info',
                        center: 'true'
                    }).then(_ => {
                        dataNode[0].status = 2
                    }).catch(_ => {

                    });
                }else if(status === 2){
                    this.$confirm('启用','提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'success',
                        center: 'true'
                    }).then(_ => {
                        dataNode[0].status = 1
                    }).catch(_ => {

                    });
                }
                return
              }else{
                idStatus = [{id:row.id, status:row.status}]
              }
          }
          if(typeof status !== 'undefined'){
              this.checkbox = true
          }else{
              this.checkbox = false
          }
          this.filterArr = idStatus
          this.viewStatus = status
          this.dialog = true
          this.show1 = true
      }
    //   ,
    //   info(row){
    //       this.dialog = true
    //   }
      ,
      info(row){
        this.dialog = true
        this.show1 = false
        this.show2 = true
      },
      isShow(row) {
        if(row.children){
            // 隐藏统一审批按钮
            return false
            let flag = row.children.some(e => {
                return e.status === 0
            })
            if(flag){
                return true
            }
        }else{
            if(row.status === 0){
                return true
            }
        }
        return false
      },
      on(row){
        if(row.children){
            let flag = row.children.some(e => {
                return e.status === 2
            })
            if(flag){
                return true
            }
        }else{
            if(row.status === 2){
                return true
            }
        }
        return false
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
            }
        }
        return false
      },
      show(row, col, status) {
          if(row.children){
            let arr = row.children
            let a=0,b=0,c=0,d=0
            arr.forEach(element => {
                if(element.status === 0){
                    a++
                }else if(element.status === 1){
                    b++
                }else if(element.status === 2){
                    c++
                }else{
                    d++
                }
            });
            return '待审批'+a+'、已启用'+b+'、已停用'+c+'、未通过'+d
          }else{
            if(status === 0){
                return '待审批'
            }else if(status === 1){
                return '已启用'
            }else if(status === 2){
                return '已停用'
            }else{
                return '未通过'
            }
          }
      },
      tableRowClassName({row, rowIndex}) {
        if(!row.children){
            if (row.status === -1) {
                return 'warning-row';
            } else if (row.status === 1) {
                return 'on-row';
            } else if (row.status === 2){
                return 'off-row'
            }
        }
        return '';
      }
    },

    data() {
      return {
        tableData: [{
          id: 1,
          date: '2019-05-02 09:10:55',
          name: '张三',
          url: '',
          endTime: '',
          status: null,
          children: [{
            id: 2,
            date: '2019-05-02 09:10:55',
            name: '张三',
            url: '/flightinfo/getCloseDoorOverTimeFlightInfo',
            endTime: '2020-05-02 09:10:55',
            status: 0,
          },{
            id: 3,
            date: '2019-05-02 09:10:55',
            name: '张三',
            url: '/flighinfo/a',
            endTime: '2020-05-02 09:10:55',
            status: 0,
          },{
            id: 5,
            date: '2019-04-02 09:10:55',
            name: '张三',
            url: '/fdexm',
            endTime: '2020-05-02 09:10:55',
            status: 1,
          },{
            id: 6,
            date: '2019-04-02 09:10:55',
            name: '张三',
            url: '/weather',
            endTime: '2020-05-02 09:10:55',
            status: 2,
          }]
        }, {
          id: 7,
          date: '2019-05-04 09:10:55',
          name: '李四',
          url: '/flightinfo,/fdexm',
          endTime: '2020-05-02 09:10:55',
          status: -1
        }, {
          id: 8,
          date: '2019-05-01 09:10:55',
          name: '王五',
          url: '/flightinfo,/fdexm',
          endTime: '2020-05-02 09:10:55',
          status: 2
        }, {
          id: 9,
          date: '2019-05-03 09:10:55',
          name: '赵六',
          url: '/flightinfo,/fdexm',
          endTime: '2020-05-02 09:10:55',
          status: 1
        }],
        selectedData: [2,3,5,6],
        filterArr: [],
        dialog: false,
        show1: false,
        viewStatus: 0,
        checkbox: true
      }
    }
}
</script>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .on-row {
    background: #9ecf84;
  }
  .el-table .off-row {
    background: #d39e97;
  }
</style>