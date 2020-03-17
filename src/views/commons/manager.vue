<template>
  <div style="padding: 20px;">
    <!--<div style="padding-bottom: 30px">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width: 20%;">
      </el-input>
    </div>-->
    <div style="float:left; width:100%;">
      <div class="tree-container">
        <el-tree class="tree" :indent="0" ref="tree" :data="treeDataRoot" :props="adccProps" node-key="id" :render-content="renderContent"
                 :expand-on-click-node="false" default-expand-all
                 :filter-node-method="filterNode">
        </el-tree>
      </div>
      <el-dialog
        :visible.sync="drawer"
        :before-close="closeDrawer"
        ref="drawer"
        :center="true"
        width="550px">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="80px" style="padding-left: 1%">
          <el-form-item label="ID" prop="id" :hidden="true">
            <el-col :span="6">
              <el-input v-model="ruleForm.id"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="PID" prop="pid" :hidden="true">
            <el-col :span="6">
              <el-input v-model="ruleForm.pid"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="父菜单" prop="pname">
            <el-col :span="12">
              <el-input v-model="ruleForm.pname" :disabled="true"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="菜单名称" prop="name">
            <el-col :span="12">
              <el-input v-model.trim="ruleForm.name"></el-input>
            </el-col>
            <!--<input class="el-input__inner" style="width: 200px;height: 36px;" type="text" v-model.trim="ruleForm.name"></input>-->
          </el-form-item>
          <el-form-item label="非页面" prop="leaf">
            <el-switch v-model="ruleForm.leaf" active-text="页面" :disabled="isEdit"></el-switch>
          </el-form-item>
          <el-form-item label="消息队列" :hidden="!ruleForm.leaf" :rules="{required: true}">
            <el-col :span="6">
              <el-form-item prop="mq" :rules="ruleForm.leaf ? dynamicRules.mq : ''">
                <el-select v-model="ruleForm.mq" placeholder="MQ类型">
                  <el-option label="Topic" value="topic"></el-option>
                  <el-option label="Queue" value="queue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="destination" :rules="ruleForm.leaf ? dynamicRules.destination : ''">
                <el-input v-model.trim="ruleForm.destination" placeholder="队列名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="type" :rules="ruleForm.leaf ? dynamicRules.type : ''">
                <el-select v-model="ruleForm.type" placeholder="数据类型">
                  <el-option label="表格数据" value="table"></el-option>
                  <el-option label="文本数据" value="text"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <!--<el-input v-model.trim="ruleForm.destination" placeholder="队列名称"  class="input-with-select">
              <el-select v-model="ruleForm.mq" placeholder="MQ类型" slot="prepend" style="width: 100px;">
                <el-option label="Topic" value="topic"></el-option>
                <el-option label="Queue" value="queue"></el-option>
              </el-select>
              <el-select v-model="ruleForm.type" placeholder="数据类型" slot="append" style="width: 120px;">
                <el-option label="表格数据" value="table"></el-option>
                <el-option label="文本数据" value="text"></el-option>
              </el-select>
            </el-input>-->

          </el-form-item>
          <el-form-item label="菜单图标" prop="icon">
            <el-select v-model="ruleForm.icon" placeholder="请选择图标" style="width: 100px;">
              <el-option label="无图标" value=""></el-option>
              <el-option label="菜单" value="tree-table"></el-option>
              <el-option label="表格" value="table"></el-option>
              <el-option label="文本" value="list"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">{{menuOperate}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--<textarea v-model="menus"></textarea>
      <textarea v-model="a"></textarea>-->
    </div>
  </div>
</template>

<script>
  import {findMenuList, createMenu, updateMenu, deleteMenus, exchangeMenu} from '@/api/user'
  //import {mapGetters} from 'vuex'
  export default {
    /*computed: {
      ...mapGetters([
        'menus'
      ])
    },*/
    name: "tree1",
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      renderContent(h, {node, data, store}){
          return(
            <span class="custom-tree-node"
            on-mouseenter = {() => this.mouseenterAct(data)} on-mouseleave = {() => this.mouseleaveAct(data)}>
            <span>{node.label}</span>
              {this.isAct == data ?
                (!data.isRoot ?
                <span>
                  {!data.leaf ?
                  <el-button type="text" icon="el-icon-plus" on-click={() => this.nodeAppend(node, data)}></el-button>
                  :
                  null}
                  <el-button type="text" icon="el-icon-edit" on-click={() => this.nodeEdit(node, data)}></el-button>
                  <el-button type="text" icon="el-icon-upload2" on-click={() => this.nodeup(node, data)}></el-button>
                  <el-button type="text" icon="el-icon-download" on-click={() => this.nodedown(node, data)}></el-button>
                  <el-button type="text" icon="el-icon-delete" on-click={() => this.nodeDelete(node, data)}></el-button>
                </span>
                :
                <span>
                  <el-button type="text" icon="el-icon-plus" on-click={() => this.nodeAppend(node, data)}></el-button>
                </span>)
              :
              null}
            </span>
          )
      },
      getMenuLIst(){
        console.log("查询菜单list")
        findMenuList().then(response => {
          this.treeData = response.data;
          this.treeDataRoot[0].children = this.treeData
          if (this.flag){
            this.flag = false
            this.$watch('treeData', this.treeDataChangeHandler)
          }
        })
        /*console.log(this.menus)
        this.$store.dispatch('user/findMenuList')
          .then(response => {
            //this.loading = false
            this.treeData = response;
            console.log(this.treeData)
            this.$store.dispatch('user/findMenus').then(_ => {
              console.log(this.menus)
              }
              //console.log("dispatch") 错误，但正常输出
              //console.log(this.menus) 错误，编译不通过
            )
          })
          .catch(() => {
            //this.loading = false
          })*/
      },
      treeDataChangeHandler(val, oldVal) {
        console.log("数据发生变更", val, oldVal)
        this.change = true
      },
      addRootMenu(){
        this.menuOperate = '添加菜单'
        this.drawer = true
        this.ruleForm.pid = 0
        this.ruleForm.pname = '根目录'
        let order = 0
        if (this.treeData && this.treeData.length){
          order = this.treeData[this.treeData.length-1].order + 1
        }
        this.ruleForm.order = order
        this.brotherName = this.treeData.map((item, index, arr) => {
          return item.name
        })
      },
      nodeEdit(node, data) {
        this.menuOperate = '更新菜单'
        if (data.children && data.children.length){
          this.isEdit = true
        }
        this.drawer = true
        this.ruleForm.id = data.id
        this.ruleForm.pid = data.pid
        this.ruleForm.pname = node.parent.label || '根目录'
        this.ruleForm.name = data.name
        this.ruleForm.leaf = data.leaf
        if (data.leaf) {
          this.ruleForm.mq = data.mq
          this.ruleForm.destination = data.destination
          this.ruleForm.type = data.type
        }
        this.ruleForm.icon = data.icon
        this.ruleForm.order = data.order
        let tempArr = node.parent.data.children || node.parent.data
        this.brotherName = tempArr.map((item, index, arr) => {
          if (item === data){
            return;
          }
          return item.name
        })
      },
      nodeAppend(node, data){
        this.menuOperate = '添加菜单'
        this.drawer = true
        this.ruleForm.pid = data.id
        this.ruleForm.pname = data.name
        let order = 0
        // console.log(data.children, data.children.length, data.children[data.children.length - 1]) //[__ob__: Observer] 0 undefined
        if (data.children && data.children.length){
          order = data.children[data.children.length - 1].order + 1
        }
        this.ruleForm.order = order
        this.brotherName = data.children.map((item, index, arr) => {
          return item.name
        })
      },
      nodeup(node, data){
        let parent = node.parent.data.children
        let id = parent.indexOf(data)
        if (id === 0) {
          this.$alert("无法再上移")
          return
        }
        this.exchange(data, parent[id - 1])
      },
      nodedown(node, data){
        let parent = node.parent.data.children
        let id = parent.indexOf(data)
        if (id === parent.length - 1) {
          this.$alert("无法再上移")
          return
        }
        this.exchange(data, parent[id + 1])
      },
      nodeDelete(node, data){
        if (data.children && data.children.length) {
          this.$confirm('该操作会同时删除子菜单','提示',{
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            center: 'true'
          }).then(_ => {
            let ids = this.recursion(data)
            deleteMenus(ids).then(response => {
                console.log(response.data)
                this.getMenuLIst()
              }
            )
          })
            .catch(_ => {

            });
        } else {
          this.$confirm('是否删除',{
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            center: 'true'
          }).then(_ => {
            let ids = this.recursion(data);
            deleteMenus(ids).then(response => {
                console.log(response.data)
                this.getMenuLIst()
              }
            )
          })
            .catch(() => {

            })
        }
      },
      recursion(data){
        let ids = []
        ids.push(data.id)
        if (data.children && data.children.length){
          for (let i = 0; i<data.children.length; i++){
            ids = ids.concat(this.recursion(data.children[i]))
          }
        }
        return ids
      },
      closeDrawer(done){
        done()
        this.$refs['ruleForm'].resetFields()
        this.ruleForm={
            id: '',
            pid: '',
            pname: '',
            name: '',
            leaf: true,
            mq: '',
            destination: '',
            type: '',
            icon: '',
            order: ''
        }
        this.isEdit = false
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let id = this.ruleForm.id
            let menu = {
              pid: this.ruleForm.pid,
              name: this.ruleForm.name,
              leaf: this.ruleForm.leaf ? 1 : 0,
              mq: this.ruleForm.mq,
              destination: this.ruleForm.destination,
              type: this.ruleForm.type,
              icon: this.ruleForm.icon,
              order: this.ruleForm.order
            }
            if (!id) {
              createMenu(menu).then(response => {
                  console.log(response.data)
                  this.getMenuLIst()
                }
              );
            } else {
              updateMenu(id, menu).then(response => {
                  console.log(response.data)
                  this.getMenuLIst()
                }
              )
            }
            this.$refs.drawer.handleClose()
            //this.closeDrawer() 无效
          } else {
            return false;
          }
        });
      },
      exchange(data1, data2) {
        let menu1 = {
          id: data1.id,
          order: data1.order
        }
        let menu2 = {
          id: data2.id,
          order: data2.order
        }
        console.log([menu1, menu2])
        exchangeMenu([menu1, menu2]).then(response => {
          console.log(response.data)
          this.getMenuLIst()
        })
      },
      mouseenterAct(data) {
          this.isAct = data
      },
      mouseleaveAct(data) {
          this.isAct = ''
      }
    },
    created(){
      console.log("created")
      this.flag = true
      this.getMenuLIst()
      //this.a = this.menus
    },
    beforeRouteLeave(to, from, next) {
      if (this.change){
        //location.reload()
        this.$router.go(0)
      }
      next()
    },
    data() {
      var nameValidator = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入菜单名称！'));
        } else if (this.brotherName.indexOf(value) !== -1) {
          callback(new Error('同级目录不能重名！'));
        } else {
          console.log(this.brotherName)
          callback()
        }
      }
      return {
        filterText: '',
        treeData: [],
        treeDataRoot: [{
          id: 0,
          isRoot: true,
          name: '根目录',
          children: []
        }],
        adccProps: {
          label: 'name',
          children: 'children'
        },
        ruleForm: {
          id: '',
          pid: '',
          pname: '',
          name: '',
          leaf: true,
          mq: '',
          destination: '',
          type: '',
          icon: '',
          order: ''
        },
        rules: {
          name: [{required: true, validator: nameValidator, trigger: 'blur'}]
        },
        dynamicRules: {
          mq: [{required: true, message: '请选择MQ类型', trigger: 'change'}],
          destination: [{required: true, message: '队列名不能为空', trigger: 'blur'}],
          type: [{required: true, message: '请选择数据类型', trigger: 'change'}]
        },
        drawer: false,
        menuOperate: '',
        //a: '',
        change: false,
        isEdit: false,
        brotherName: [],
        isAct: ''
      }
    }
  }
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    /*justify-content: space-between;*/
    font-size: 18px;
    padding-right: 8px;
  }
  .tree /deep/ .el-tree-node {
    position: relative;
    padding-left: 16px;
  }
  .tree /deep/ .el-tree-node__children {
    padding-left: 16px;
  }
  .tree /deep/ .el-tree-node :last-child:before {
    height: 38px;
  }
  .tree /deep/ .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .tree-container /deep/ .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .tree-container /deep/ .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .tree /deep/ .el-tree-node:before {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree /deep/ .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree /deep/ .el-tree-node:before {
    border-left: 1px dashed #4386c6;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 20px;
  }
  .tree /deep/ .el-tree-node:after {
    border-top: 1px dashed #4386c6;
    height: 20px;
    top: 12px;
    width: 24px;
  }
  .tree-container {
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
    color: #606266;
  }
  .input-with-select .el-input-group__append {
    background-color: #fff;
    color: #606266;
  }
</style>
