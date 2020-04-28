<template>
    <el-form label-position="left" label-width="100px">
        <!-- <el-form-item label="用户">
            <el-input v-model="test" :disabled="true" />
        </el-form-item> -->
        <el-form-item label="已申请接口">
            <el-cascader
                ref="cascader"
                v-model="selectedIds"
                :options="data"
                :props="props"
                :show-all-levels="false">
            </el-cascader>
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
            const nodes = this.$refs.cascader.getCheckedNodes(true)
            return  {
                ids: nodes.map(node => node.data.id),
                expireTime: this.value1
            }
        }
    },
    data(){
        return{
            props: { 
                multiple: true,
                value: 'id'
            },
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
            selectedIds: this.selected,
            value1: ''
        }
    }
}
</script>