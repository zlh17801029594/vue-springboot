<template>
  <el-form label-position="left" :model="api" inline class="demo-table-expand">
    <el-form-item label="接口描述">
      <span>{{ api.label }}</span>
    </el-form-item>
    <el-form-item label="接口uri">
      <span>{{ api.uri }}</span>
    </el-form-item>
    <el-form-item label="请求方法">
      <span>{{ api.method }}</span>
    </el-form-item>
    <el-form-item label="请求参数">
      <span>
        <el-table :data="api.otherInfo.parameters" stripe border style="width: 100%;">
          <el-table-column label="参数名" prop="name"></el-table-column>
          <el-table-column label="参数位置" prop="in"></el-table-column>
          <el-table-column label="参数描述" prop="description"></el-table-column>
          <el-table-column label="是否必须" prop="required" :formatter="booleanFormat"></el-table-column>
          <el-table-column label="参数类型" prop="type"></el-table-column>
          <el-table-column label="是否可以为空白字符串" prop="allowEmptyValue" :formatter="booleanFormat"></el-table-column>
          <el-table-column label="参数样例" prop="example"></el-table-column>
        </el-table>
      </span>
    </el-form-item>
    <el-form-item label="返回结果样例">
      <pre v-html="syntaxHighlight(api.otherInfo.result)"></pre>
      <!--<pre>{{ api.result}}</pre>-->
      <!--<span>{{ api.result}}</span>-->
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
      <span>{{ api.otherInfo.consumes }}</span>
    </el-form-item>
    <el-form-item label="返回结果方式">
      <span>{{ api.otherInfo.produces }}</span>
    </el-form-item>
    <el-form-item label="响应码">
      <el-table :data="api.otherInfo.responses" stripe border style="width: 100%;">
        <el-table-column label="响应码" prop="code"></el-table-column>
        <el-table-column label="描述" prop="description"></el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>
<script>
import {getServiceDetails} from '@/api/ms_api'
export default {
  name: "apiInfo",
  props: {
    apiId: {
      type: Number
    }
  },
  data() {
    return {
      api: {
        label: '',
        uri: '',
        method: '',
        otherInfo: {
          parameters: undefined,
          result: undefined,
          consumes: undefined,
          produces: undefined,
          responses: undefined
        }
      }
    };
  },
  watch: {
    apiId(){
      this.serviceDetails()
    }
  },
  created(){
    this.serviceDetails()
  },
  methods: {
    serviceDetails(){
      getServiceDetails(this.apiId).then(response => {
        this.api = response.data
      })
    },
    booleanFormat(row, col, cellValue) {
      let value = "";
      if (cellValue) {
        value = "是";
      } else {
        value = "否";
      }
      return value;
    },
    syntaxHighlight(json) {
      if(json){
        if (typeof json != "string") {
          json = JSON.stringify(json, undefined, 2);
        }
        json = json
          .replace(/&/g, "&")
          .replace(/</g, "<")
          .replace(/>/g, ">");
        return json.replace(
          /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
          function(match) {
            let cls = "number";
            if (/^"/.test(match)) {
              if (/:$/.test(match)) {
                cls = "key";
              } else {
                cls = "string";
              }
            } else if (/true|false/.test(match)) {
              cls = "boolean";
            } else if (/null/.test(match)) {
              cls = "null";
            }
            return '<span class="' + cls + '">' + match + "</span>";
          }
        );
      }
    }
  }
};
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
.string {
  color: green;
}
.number {
  color: darkorange;
}
.boolean {
  color: blue;
}
.null {
  color: magenta;
}
.key {
  color: red;
}
</style>