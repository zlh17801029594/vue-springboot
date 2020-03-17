<template>
  <div class="app-container">
    <el-collapse v-for="(service) in data" v-model="activeNames" @change="handleChange">
      <el-collapse-item :title="titleFormat([service.label, service.basePath, service.host])">
        <el-collapse v-for="(controller) in service.children" v-model="activeNames1" style="padding-left: 20px">
          <el-collapse-item :title="titleFormat([controller.label, controller.name])">
            <el-table :data="controller.children" stripe border style="width: 100%;" @selection-change="handleSelectionChange">
              <el-table-column type="selection">
              </el-table-column>
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
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import {getService} from '@/api/user'
  export default {
    name: "services-panel",
    data() {
      return {
        activeNames: [],
        activeNames1: [],
        data: [],
        test: [{
          name: 'zhou',
          age: '24'
        },{
          name: 'ming',
          age: '25'
        }]
      }
    },
    methods: {
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
      }
    },
    created() {
      getService().then(response => {
        this.data = response.data
        //console.log(response.data)
      })
    }
  }
</script>

<style>
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
</style>
