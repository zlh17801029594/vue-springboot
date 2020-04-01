<template>
    <el-form label-position="left" label-width="100px">
        <el-form-item label="用户">
            <el-input value="admin" :disabled="true" />
        </el-form-item>
        <el-form-item label="已申请接口">
            <el-cascader
            ref="cascader"
            v-model="selected1"
            :options="options1"
            :props="props"
            :show-all-levels="false"
            @change="change"></el-cascader>
        </el-form-item>
        <el-form-item label="使用截至日期">
            <el-date-picker
            v-model="value1"
            type="datetime"
            placeholder="选择日期时间"/>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    name: 'info',
    props:{
        options:{
            type: Array
        },
        selected: {
            type: Array
        }
    },
    computed: {
        
    },
    methods:{
        change(){
            console.log(this.selected)
            console.log(this.selected1)
            console.log(this.$refs.cascader.getCheckedNodes(true))
        }
    },
    data(){
        return{
            props: { 
                multiple: true,
                value: 'id'
            },
            selected1: [[1,2], [1, 3]],
            options1: [{
                id: 1,
                label: 'Flightinfo信息服务',
                children: [{
                    id: 2,
                    label: '关舱门时间'
                },{
                    id: 3,
                    label: '开舱门时间'
                }]
                },{
                    id: 4,
                    label: 'Fdexm信息服务',
                    children: [{
                        id: 5,
                        label: '接口1'
                    },{
                        id: 6,
                        label: '接口2'
                    }]
            }],
            value1: ''
        }
    }
}
</script>