<template>
    <el-tree
            ref="tree"
            :data="treeData"
            :show-checkbox="checkbox"
            node-key="id"
            highlight-current
            default-expand-all
            :expand-on-click-node="true"
            >
            <span class="custom-tree-node" slot-scope="{node, data}">
                <span :style="{color: colors(data)}">{{node.label}}</span>
                <span>
                </span>
            </span>
     </el-tree>
</template>
<script>
export default {
    name: 'tree',
    props:{
        filterArr:{
            type: Array
        },
        checkbox:{
            type: Boolean
        }
    },
    computed: {
        treeData(){
            let data = [{
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
            }]
            let filterArrTemp = this.filterArr
            let treeDataTemp = []
            if(filterArrTemp){
                let ids = filterArrTemp.map(e=>{
                    return e['id']
                })
                data.forEach(e=>{
                    if(e.children){
                        let flag = e.children.some(e1=>{
                            return ids.indexOf(e1.id) !== -1
                        })
                        if(flag){
                            let fath = {
                                id: e.id,
                                label: e.label,
                                children:[]
                            }
                            treeDataTemp.push(fath)
                            e.children.forEach(e2=>{
                                if(ids.indexOf(e2.id) !== -1){
                                    let status
                                    filterArrTemp.forEach(e3=>{
                                        if(e3.id === e2.id){
                                            status = e3['status']
                                        }
                                    })
                                    let chil = {
                                        id: e2.id,
                                        label: e2.label,
                                        status: status
                                    }
                                    fath.children.push(chil)
                                }
                            })

                            // forEach中删除节点，导致：若第一个节点被删除，则遍历不经过第二个节点。直接push
                            // e.children.forEach(e2=>{
                            //     if(ids.indexOf(e2.id) !== -1){
                            //         let status
                            //         filterArrTemp.forEach(e3=>{
                            //             if(e3.id === e2.id){
                            //                 status = e3['status']
                            //             }
                            //         })
                            //         this.$set(e2, 'status', status)
                            //     }else{
                            //         let index = e.children.findIndex(d=>d.id === e2.id)
                            //         e.children.splice(index, 1)
                            //     }
                            // })
                            // treeDataTemp.push(e)
                        }
                    }else{
                        if(ids.indexOf(e.id) !== -1){
                            let status
                            filterArrTemp.forEach(e1=>{
                                if(el.id === e.id){
                                    status = e1['status']
                                }
                            })
                            let fath = {
                                        id: e.id,
                                        label: e.label,
                                        status: status
                                    }
                            treeDataTemp.push(fath)
                        }
                        // if(ids.indexOf(e.id) !== -1){
                        //     let status
                        //     filterArrTemp.forEach(e1=>{
                        //         if(el.id === e.id){
                        //             status = e1['status']
                        //         }
                        //     })
                        //     this.$set(e, 'status', status)
                        //     treeDataTemp.push(e)
                        // }
                    }
                })
            }
            console.log(this.filterArr)
            console.log(treeDataTemp)
            return treeDataTemp
        }
    },
    watch: {
        filterArr(newVal, oldVal){
            // if(val === oldVal){
            //     return
            // }
            console.log('oldval', oldVal)
            console.log('newval', newVal)
            console.log('checkdedKeys', this.$refs.tree.getCheckedKeys(true, false))
        }
        // filterArr: {
        //     handler(newVal){
        //         console.log(this.$refs.tree.getCheckedKeys(true, false))
        //     },
        //     immediate: true
        // }
    },
    methods:{
        getIds(){
            return this.$refs.tree.getCheckedKeys(true, false)
        },
        colors(data){
            console.log(data)
            if(data.status === 0){
                return 'red'
            }else if(data.status === 1){
                return 'green'
            }else if(data.status === 2){
                return 'yellow'
            }
        }
    },
    data(){
        return{
        }
    },
    beforeCreate(){
        console.log('beforeCreate')
    },
    created(){
        console.log('created')
    },
    beforeMount(){
        console.log('beforeMount')
    },
    mounted(){
        let ids = this.filterArr.map(e=>{
            return e['id']
        })
        this.$refs.tree.setCheckedKeys(ids)
        console.log('mounted')
    },
    beforeUpdate(){
        console.log('beforeUpdate')
    },
    updated(){
        let ids = this.filterArr.map(e=>{
            return e['id']
        })
        this.$refs.tree.setCheckedKeys(ids)
        console.log('updated')
    },
    beforeDestroy(){
        console.log('beforeDestroy')
    },
    destroyed(){
        console.log('destoryed')
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
</style>