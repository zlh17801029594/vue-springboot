<template>
  <el-form label-position="left" :model="api" inline class="demo-table-expand">
    <el-form-item :label="api.type ? '接口名称' : '微服务名称'">
      <span>{{ api.name }}</span>
    </el-form-item>
    <el-form-item :label="api.type ? '接口描述' : '微服务描述'">
      <span>{{ api.description }}</span>
    </el-form-item>
    <el-form-item v-if="!api.type" label="host地址">
      <span>{{ api.host }}</span>
    </el-form-item>
    <el-form-item label="url">
      <span>{{ api.url }}</span>
    </el-form-item>
    <el-form-item v-if="api.type" label="请求方式">
      <span>{{ api.httpMethod }}</span>
    </el-form-item>
    <div v-if="api.type && api.apiDetails && api.apiDetails.otherInfo">
      <el-form-item label="请求参数">
        <span>
          <el-table :data="api.apiDetails.otherInfo.parameters" stripe border style="width: 100%;">
            <el-table-column label="参数名" prop="name" />
            <el-table-column label="参数位置" prop="in" />
            <el-table-column label="参数描述" prop="description" />
            <el-table-column label="是否必须" prop="required" :formatter="booleanFormat" />
            <el-table-column label="参数类型" prop="type" />
            <el-table-column label="是否可以为空白字符串" prop="allowEmptyValue" :formatter="booleanFormat" />
            <el-table-column label="参数样例" prop="example" />
          </el-table>
        </span>
      </el-form-item>
      <el-form-item label="返回结果样例">
        <pre v-html="syntaxHighlight(api.apiDetails.otherInfo.result)" />
      </el-form-item>
      <el-form-item label="接收参数方式">
        <span>{{ api.apiDetails.otherInfo.consumes }}</span>
      </el-form-item>
      <el-form-item label="返回结果方式">
        <span>{{ api.apiDetails.otherInfo.produces }}</span>
      </el-form-item>
      <el-form-item label="响应码">
        <el-table :data="api.apiDetails.otherInfo.responses" stripe border style="width: 100%;">
          <el-table-column label="响应码" prop="code" />
          <el-table-column label="描述" prop="description" />
        </el-table>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
export default {
  name: 'ApiInfo',
  props: {
    api: {
      type: Object
    }
  },
  data() {
    return {
      apiData: {
        type: true,
        name: '',
        description: '',
        host: '',
        url: '',
        httpMethod: '',
        apiDetails: {
          otherInfo: {
            parameters: undefined,
            result: '',
            consumes: undefined,
            produces: undefined,
            responses: undefined
          }
        }
      }
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
    booleanFormat(row, col, cellValue) {
      let value = ''
      if (cellValue) {
        value = '是'
      } else {
        value = '否'
      }
      return value
    },
    syntaxHighlight(json) {
      if (json) {
        if (typeof json !== 'string') {
          json = JSON.stringify(json, undefined, 2)
        }
        json = json
          .replace(/&/g, '&')
          .replace(/</g, '<')
          .replace(/>/g, '>')
        return json.replace(
          /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
          function(match) {
            let cls = 'number'
            if (/^"/.test(match)) {
              if (/:$/.test(match)) {
                cls = 'key'
              } else {
                cls = 'string'
              }
            } else if (/true|false/.test(match)) {
              cls = 'boolean'
            } else if (/null/.test(match)) {
              cls = 'null'
            }
            return '<span class="' + cls + '">' + match + '</span>'
          }
        )
      }
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
.string {
  color: green;
  /* 字符串类型自动换行 */
  white-space: pre-line;
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
