<template>
    <el-form label-position="left" :model="applyForm" :rules="applyRules" ref="applyForm"  label-width="120px">
        <el-form-item label="已选择接口" prop="ids">
            <el-col :span="16">
                <el-cascader
                    ref="cascader"
                    v-model="applyForm.ids"
                    :options="data"
                    :props="props"
                    :show-all-levels="false"
                    style="width: 100%">
                </el-cascader>
            </el-col>
        </el-form-item>
        <el-form-item label="使用截至日期" prop="datetime">
            <el-col :span="16">
                <el-date-picker
                v-model="applyForm.datetime"
                type="datetime"
                placeholder="选择日期"
                :picker-options="pickerOptions"
                style="width: 100%"
                />
            </el-col>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    name: 'info',
    props:{
        data:{
            type: Array
        },
        selected: {
            type: Array
        }
    },
    computed: {
        // selectedIds(){
        //     return this.selected
        // }
    },
    methods:{
        change(){
            console.log(this.selectedIds)
            console.log(this.$refs.cascader.getCheckedNodes(true))
        },
        getApply(){
            let flag
            this.$refs.applyForm.validate((valid) => {
                if (valid) {
                    // alert('submit!');
                    flag = true
                } else {
                    console.log('error submit!!');
                    flag = false
                    return false;
                }
            });
            if(flag){
                const nodes = this.$refs.cascader.getCheckedNodes(true)
                return  {
                    ids: nodes.map(node => node.data.id),
                    expireTime: this.applyForm.datetime
                }
            }
        }
    },
    data(){
        var datatimeVali = (rule, value, callback) => {
            console.log(value)
            if (!value) {
            callback(new Error('请选择使用截至日期'));
            } else if (value <= Date.now()) {
            callback(new Error('截至时间不能早于当前时间'));
            } else {
            callback();
            }
        };
        return{
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                },
                shortcuts: [{
                    text: '一天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() + 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一个月',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '三个月',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() + 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '六个月',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() + 3600 * 1000 * 24 * 180);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一年',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() + 3600 * 1000 * 24 * 360);
                    picker.$emit('pick', date);
                    }
                }]
            },
            props: { 
                multiple: true,
                value: 'id'
            },
            selectedIds: this.selected,
            applyForm: {
                ids: this.selected,
                datetime: ''
            },
            applyRules: {
                ids: [
                    { type: 'array', required: true, message: '请至少选择一个接口', trigger: 'change' }
                ],
                datetime: [
                    // { type: 'date', required: true, message: '请选择使用截至日期', trigger: 'change' }
                    { validator: datatimeVali, required: true, trigger: 'change' }
                ]
            }
        }
    }
}
</script>