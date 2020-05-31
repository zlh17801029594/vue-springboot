<template>
  <el-form ref="applyForm" label-position="left" :model="applyForm" :rules="applyRules" label-width="120px">
    <el-form-item label="已选择接口" prop="ids">
      <el-col :span="24">
        <el-cascader
          ref="cascader"
          v-model="applyForm.ids"
          :options="data"
          :props="props"
          :show-all-levels="false"
          style="width: 100%"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="使用截至日期" required>
      <el-col :span="11">
        <el-form-item prop="date1">
          <el-date-picker v-model="applyForm.date1" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
      </el-col>
      <el-col style="text-align: center;" :span="2">-</el-col>
      <el-col :span="11">
        <el-form-item prop="date2">
          <el-time-picker v-model="applyForm.date2" value-format="HH:mm:ss" placeholder="选择时间" style="width: 100%;" />
        </el-form-item>
      </el-col>
      <!-- <el-col :span="16">
                <el-date-picker
                v-model="applyForm.datetime"
                type="datetime"
                placeholder="选择日期"
                :picker-options="pickerOptions"
                style="width: 100%"
                />
            </el-col> -->
    </el-form-item>
  </el-form>
</template>
<script>
import { parseTime } from '@/utils'
export default {
  name: 'Info',
  props: {
    data: {
      type: Array
    },
    selected: {
      type: Array
    }
  },
  data() {
    var datatimeVali1 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择日期'))
      } else {
        const date2 = this.applyForm.date2
        if (date2) {
          this.$refs.applyForm.validateField('date2')
        }
        callback()
      }
    }
    var datatimeVali2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择时间'))
      } else {
        const date1 = this.applyForm.date1
        if (date1) {
          const datetime = new Date(value + ' ' + date1)
          if (datetime <= Date.now()) {
            callback(new Error('不能早于当前时间'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        },
        shortcuts: [{
          text: '一天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '近一个月',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', date)
          }
        }, {
          text: '近三个月',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 90)
            picker.$emit('pick', date)
          }
        }, {
          text: '近六个月',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 180)
            picker.$emit('pick', date)
          }
        }, {
          text: '近一年',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 365)
            picker.$emit('pick', date)
          }
        }]
      },
      props: {
        multiple: true,
        label: 'name',
        value: 'id'
      },
      selectedIds: this.selected,
      applyForm: {
        ids: [],
        date1: '',
        date2: ''
      },
      applyRules: {
        ids: [
          { type: 'array', required: true, message: '请至少选择一个接口', trigger: 'change' }
        ],
        date1: [
          // { type: 'date', required: true, message: '请选择使用截至日期', trigger: 'change' }
          { validator: datatimeVali1, required: true, trigger: 'change' }
        ],
        date2: [
          // { type: 'date', required: true, message: '请选择使用截至日期', trigger: 'change' }
          { validator: datatimeVali2, required: true, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    // selectedIds(){
    //     return this.selected
    // }
  },
  watch: {
    selected() {
      this.showApply()
    }
  },
  created() {
    this.showApply()
  },
  methods: {
    showApply() {
      this.applyForm = {
        ids: this.selected,
        date1: '',
        date2: '00:00:00'
      }
      this.$nextTick(() => {
        this.$refs.applyForm.clearValidate()
      })
    },
    change() {
      console.log(this.selectedIds)
      console.log(this.$refs.cascader.getCheckedNodes(true))
    },
    getApply() {
      let flag
      console.log(this.applyForm)
      this.$refs.applyForm.validate((valid) => {
        if (valid) {
          // alert('submit!');
          flag = true
        } else {
          console.log('error submit!!')
          flag = false
          return false
        }
      })
      if (flag) {
        const nodes = this.$refs.cascader.getCheckedNodes(true)
        return {
          ids: nodes.map(node => node.data.id),
          //   expireTime: parseTime(this.applyForm.datetime),
          expireTime: this.applyForm.date1 + ' ' + this.applyForm.date2,
          applyDetailss: nodes.map(node => {
            return {
              apiId: node.data.id
            }
          })
        }
      }
    }
  }
}
</script>
