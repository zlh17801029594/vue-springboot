<template>
  <el-container>
    <el-header align="right">
        <el-button type="primary" @click="click1">申请接口</el-button>
    </el-header>
    <el-container>
        <el-aside ref="left">
            <el-tree
            ref="tree"
            :data="data"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            @node-click="clickNode"
            :props="defaultProps">
            <span class="custom-tree-node" slot-scope="{node, data}">
                <span>{{node.label}}</span>
                <span>
                
                </span>
            </span>
            </el-tree>
        </el-aside>
        <el-main ref="right">
            <el-collapse v-for="(service) in data" v-model="activeNames" @change="handleChange" accordion>
                <el-collapse-item :title="titleFormat([service.label, service.basePath])" :name="service.label">
                            <el-table :data="service.children" stripe border style="width: 100%;" @selection-change="handleSelectionChange">
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <el-form-item label="接口描述">
                                    <span>{{ props.row.label }}</span>
                                    </el-form-item>
                                    <el-form-item label="接口uri">
                                    <span>{{ props.row.uri }}</span>
                                    </el-form-item>
                                    <el-form-item label="请求方法">
                                    <span>{{ props.row.method }}</span>
                                    </el-form-item>
                                    <el-form-item label="请求参数">
                                    <span>
                                        <el-table :data="props.row.parameters" stripe border style="width: 100%;">
                                        <el-table-column
                                            label="参数名"
                                            prop="name">
                                        </el-table-column>
                                        <el-table-column
                                            label="参数位置"
                                            prop="in">
                                        </el-table-column>
                                        <el-table-column
                                            label="参数描述"
                                            prop="description">
                                        </el-table-column>
                                        <el-table-column
                                            label="是否必须"
                                            prop="required"
                                            :formatter="booleanFormat">
                                        </el-table-column>
                                        <el-table-column
                                            label="参数类型"
                                            prop="type">
                                        </el-table-column>
                                        <el-table-column
                                            label="是否可以为空白字符串"
                                            prop="allowEmptyValue"
                                            :formatter="booleanFormat">
                                        </el-table-column>
                                        <el-table-column
                                            label="参数样例"
                                            prop="example">
                                        </el-table-column>
                                        </el-table>
                                    </span>
                                    </el-form-item>
                                    <el-form-item label="返回结果样例">
                                    <pre v-html="syntaxHighlight(props.row.result)"></pre>
                                    <!--<pre>{{ props.row.result}}</pre>-->
                                    <!--<span>{{ props.row.result}}</span>-->
                                    <!--:span布局-->
                                    <!--<span>
                                        <div  v-for="person in test" style="width: 100%;">
                                        <el-row>
                                            <el-col :span="8">{{person.name}}</el-col>
                                            <el-col :span="8">{{person.age}}</el-col>
                                        </el-row>
                                        </div>
                                    </span>-->
                                    </el-form-item>
                                    <el-form-item label="接收参数方式">
                                    <span>{{ props.row.consumes }}</span>
                                    </el-form-item>
                                    <el-form-item label="返回结果方式">
                                    <span>{{ props.row.produces }}</span>
                                    </el-form-item>
                                    <el-form-item label="响应码">
                                    <el-table :data="props.row.responses" stripe border style="width: 100%;">
                                        <el-table-column
                                        label="响应码"
                                        prop="code">
                                        </el-table-column>
                                        <el-table-column
                                        label="描述"
                                        prop="description">
                                        </el-table-column>
                                    </el-table>
                                    </el-form-item>
                                </el-form>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="接口uri"
                                prop="uri">
                            </el-table-column>
                            <el-table-column
                                label="接口描述"
                                prop="label">
                            </el-table-column>
                            <el-table-column
                                label="请求方法"
                                prop="method">
                            </el-table-column>
                            </el-table>
                </el-collapse-item>
            </el-collapse>
        </el-main>
    </el-container>
    <el-dialog
        :visible.sync="drawer"
        :before-close="closeDrawer"
        ref="drawer"
        :center="true"
        width="550px">
        <info :options='data' :selected='selected' />
    </el-dialog>
  </el-container>
</template>

<script>
import {getService} from '@/api/user'
import {getToken} from '@/utils/auth'
import BScroll from 'better-scroll'
import info from './apply-for-info'

export default {
    components: {
        info
    },
    data() {
      return {
        activeNames: [],
        activeNames1: [],
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        test: [{
          name: 'zhou',
          age: '24'
        },{
          name: 'ming',
          age: '25'
        }],
        drawer: false,
        selected: []
      }
    },
    methods: {
      click1(){
        this.selected = this.$refs.tree.getCheckedNodes(true, false)
        console.log(this.selected)
        this.drawer = true
      },
      closeDrawer(done){
        done()
      },
      clickNode (data, node, obj) {	
      //点击节点触发,不同层级的level事件不同
      //可对应界面变化，比如通过v-if控制模块显隐
        if (node.level === 1) {
            this.activeNames = data.label
            console.log(this.activeNames, this.activeNames1)
        //   this.currLevel = 1
        //   this.currSignal = node.data
        } else if (node.level === 2) {
            this.activeNames = node.parent.label
            this.activeNames1 = [data.label]
            console.log(this.activeNames, this.activeNames1)
        //   this.currLevel = 2
        //   this.currChannel = node.data
        } else if (node.level === 3) {
            this.activeNames = node.parent.parent.label
            this.activeNames1 = [node.parent.label]
            console.log(this.activeNames, this.activeNames1)
		}
      },
      handleChange(val) {
        console.log(val)
      },
      handleSelectionChange(val) {
        console.log(val)
      },
      booleanFormat(row, col, cellValue){
        let value = ''
        if (cellValue) {
          value = '是';
        } else {
          value = '否'
        }
        return value
      },
      titleFormat(list) {
        let title = ''
        list.forEach(value => {
          if (value){
            title += value
            title += "\t"
          }
        })
        return title
      },
      syntaxHighlight(json) {
        if (typeof json != 'string') {
          json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
          let cls = 'number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
            } else {
              cls = 'string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
        });
      },
      _initScroll(){
          this.left = new BScroll((this.$refs.left), {
              click: true
          })
          this.right = new BScroll((this.$refs.right), {
              click: true
          })
      }
    },
    created() {
      getService(getToken()).then(response => {
        this.data = response.data
        //console.log(response.data)
      })
    }
}
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  /*pre {outline: 1px solid #ccc; }*/
  .string { color: green; }
  .number { color: darkorange; }
  .boolean { color: blue; }
  .null { color: magenta; }
  .key { color: red; }

  .el-aside{
      padding: 0px
  }
  .el-main{
      padding: 0px
  }
  .el-header{
      padding-top: 10px
  }
</style>