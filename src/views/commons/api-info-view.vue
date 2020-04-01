<template>
    <el-form label-position="left" inline class="demo-table-expand">
        <el-form-item label="接口描述">
        <span>{{ jsonData.label }}</span>
        </el-form-item>
        <el-form-item label="接口uri">
        <span>{{ jsonData.uri }}</span>
        </el-form-item>
        <el-form-item label="请求方法">
        <span>{{ jsonData.method }}</span>
        </el-form-item>
        <el-form-item label="请求参数">
        <span>
            <el-table :data="jsonData.parameters" stripe border style="width: 100%;">
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
        <pre v-html="syntaxHighlight(jsonData.result)"></pre>
        <!--<pre>{{ jsonData.result}}</pre>-->
        <!--<span>{{ jsonData.result}}</span>-->
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
        <span>{{ jsonData.consumes }}</span>
        </el-form-item>
        <el-form-item label="返回结果方式">
        <span>{{ jsonData.produces }}</span>
        </el-form-item>
        <el-form-item label="响应码">
        <el-table :data="jsonData.responses" stripe border style="width: 100%;">
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
<script>
export default {
    name: 'apiInfo',
    data() {
        return{
            jsonData: {
                uri: "/flightinfo/getCloseDoorOverTimeFlightInfo",
                method: "get",
                controllers: [
                    "flight-info-controller"
                ],
                operationId: "getCloseDoorOverTimeFlightInfoUsingGET",
                consumes: [
                    "*/*"
                ],
                produces: [
                    "application/xml",
                    "application/json"
                ],
                parameters: [
                    {
                        "name": "airport",
                        "in": "query",
                        "description": "起飞机场四码",
                        "required": true,
                        "type": "string",
                        "allowEmptyValue": false,
                        "example": "ZUUU"
                    },
                    {
                        "name": "from",
                        "in": "query",
                        "description": "计划起飞时间查询起始时间",
                        "required": true,
                        "type": "string",
                        "allowEmptyValue": false,
                        "example": "2018-11-04T00:00:00Z"
                    },
                    {
                        "name": "to",
                        "in": "query",
                        "description": "计划起飞时间查询结束时间",
                        "required": true,
                        "type": "string",
                        "allowEmptyValue": false,
                        "example": "2018-11-05T00:00:00Z"
                    }
                ],
                result: [
                    {
                        "acid": "string",
                        "eobt": "2020-03-24T04:44:17.802+0000",
                        "atot": "2020-03-24T04:44:17.802+0000",
                        "overtimeMinutes": 0,
                        "agct": "2020-03-24T04:44:17.802+0000",
                        "sobt": "2020-03-24T04:44:17.802+0000",
                        "dest": "string",
                        "sibt": "2020-03-24T04:44:17.802+0000",
                        "dep": "string"
                    }
                ],
                responses: [
                    {
                        "code": "200",
                        "description": "请求成功"
                    },
                    {
                        "code": "401",
                        "description": "未认证"
                    },
                    {
                        "code": "403",
                        "description": "权限不足"
                    },
                    {
                        "code": "404",
                        "description": "未找到"
                    },
                    {
                        "code": "500",
                        "description": "请求失败"
                    }
                ],
                deprecated: false,
                label: "关舱门超时航班信息"
            }
        }
    },
    methods: {
      booleanFormat(row, col, cellValue){
        let value = ''
        if (cellValue) {
          value = '是';
        } else {
          value = '否'
        }
        return value
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
  .string { color: green; }
  .number { color: darkorange; }
  .boolean { color: blue; }
  .null { color: magenta; }
  .key { color: red; }
</style>