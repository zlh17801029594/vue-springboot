<template>
  <div class="app-container">
    <el-table :data="tableData" :stripe="true" border fit highlight-current-row style="width: 100%">
      <el-table-column v-for="(item,index) in tableHead" :prop="item.nameProp" :label="item.nameLable" :key="index"></el-table-column> 
    </el-table> 
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
  import Pagination from '@/components/Pagination'
  export default {
    data(){
      return{
        websocket: null,
        flag: true,
        datas: [],
        tableHead: [],
        tableData: [],
        total: 0,
        listQuery: {
          page: 1,
          limit: 20
        }
      }
    },
    // 两种均可
    // props: ['route'],
    props: {
      route: {
        type: Object
      },
      cacheNum: {
        type: Number
      },
      requestUrl: String
    },
    components: {
      Pagination
    },
    methods:{
      getList(){
        this.total = this.datas.length
        this.tableData = this.datas.slice((this.listQuery.page-1)*this.listQuery.limit, (this.listQuery.page-1)*this.listQuery.limit + this.listQuery.limit)
      },
      open3() {
        this.$message({
          showClose: true,
          message: '未配置mq信息，无法展示',
          type: 'warning'
        });
      },
      open4() {
        this.$message({
          showClose: true,
          message: '无法连接到指定mq',
          type: 'error'
        });
      },
      initWebsocket(){
        if ('WebSocket' in window) {
          // console.log(this.route.mq, this.route.destination, this.route.mq && this.route.destination)
          if (!(this.route.mq && this.route.destination)) {
            this.open3();
            return;
          } else {
            this.websocket = new WebSocket(this.requestUrl.replace("http", "ws") + "/websocket/" + this.route.mq + ":" + this.route.destination.replace(/\//g,":"));
          }
        } else {
          alert('Not support WebSocket');
        }
        this.websocket.onmessage = this.websocketOnmessage;
        this.websocket.onopen = () => {
          console.log("open")
        }
        this.websocket.onerror = () => {
          console.log("error")
        }
        this.websocket.onclose = () => {
          console.log("close")
        }
        /*this.over = () => {
          this.closeWebsocket()
        }*/
        this.a = () => {
          console.log("zhoulihuang", this)
        }
      },
      over(){
        this.closeWebsocket()
      },
      closeWebsocket(){
        if (this.websocket){
          this.websocket.close()
        }
      },
      websocketOnmessage(event){
        if (this.route.type === 'table') {
          let render = JSON.parse(event.data);
          // console.log(this, this.flag)
          if (this.flag) {
            this.tableHead = converter3(render[0])
            this.flag = false
          }
          console.log(render)
          this.datas = render.reverse().concat(this.datas)
          while(this.datas.length > this.cacheNum){
            this.datas.pop()
          }
          this.getList()
        } else if (this.route.type === 'text') {
          if (this.flag) {
            this.tableHead = [{nameLable: '收到消息', nameProp: 'message'}]
            this.flag = false;
          }
          let render = [{message: "接收时间：" + new Date().format("yyyy-MM-dd hh:mm:ss") + "\n" + event.data}]
          console.log(render)
          this.datas = render.reverse().concat(this.datas)
          while(this.datas.length > this.cacheNum){
            this.datas.pop()
          }
          this.getList()
        }
      }
    }/*,
    beforeRouteEnter(to, from, next){
      next(vm => {
        vm.initWebsocket()
      })
    },
    beforeRouteLeave(to, from, next){
      this.over()
      //this.a()
      console.log(this)
      next()
    }*/,
    beforeCreate() {
      console.log("beforeCreate: children-", "我还未定义")
    },
    created() {
      console.log("created: children-", this.route.name)
    },
    beforeMount() {
      console.log("beforeMount: children-", this.route.name)
    },
    mounted() {
      console.log("mounted: children-", this.route.name)
    },
    beforeUpdate() {
      console.log("beforeUpdate: children-", this.route.name)
    },
    updated() {
      console.log("updated: children-", this.route.name)
    },
    activated() {
      console.log("activated: children-", this.route.name)
    },
    deactivated() {
      console.log("deactivated: children-", this.route.name)
    },
    beforeDestroy() {
      console.log("beforeDestroy: children-", this.route.name)
    },
    destroyed() {
      console.log("destroyed: children-", this.route.name)
    }
  }
  function converter3(obj) {
    let col = [];
    for (let key in obj){
      col.push({nameLable: key, nameProp: key});
    }
    return col
  }
  Date.prototype.format = function (format) {
    let args = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3)/3),
      "S": this.getMilliseconds()
    }
    if (/(y+)/.test(format))
      format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    for (var i in args) {
      let n = args[i]
      if (new RegExp("(" + i + ")").test(format))
        format  = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length))
    }
    return format
  }
</script>
<style>
  .el-table .cell{
    white-space: pre-line;
  }
</style>
