<template>
    <el-container>
        <el-main>
            <el-form label-width="100">
                <el-form-item label="A+">
                </el-form-item>
                <el-form-item label="A" v-if="show.a">
                </el-form-item>
                <el-form-item label="B" v-show="show.b">
                </el-form-item>
                <el-form-item label="C" :hidden="show.c">
                </el-form-item>
                <el-form-item label="D" :style="{display: show.d}">
                </el-form-item>
                <el-form-item label="E" :style="{visibility: show.e}">
                </el-form-item>
                <el-form-item label="E+">
                    {{b}}
                </el-form-item>
                <el-form-item label="a">
                    <el-col :span="6">
                        {{show.a}}
                    </el-col>
                    <el-col :span="6">
                        <!-- :hidden对el-button无效，对el-form-item有效 -->
                        <!-- 推测： :hidden用于el-form-item 正是 html中隐藏表单元素的体现。即:hidden中的信息也会提交 -->
                        <!-- :style="{display: 'none'}" 对el-button、el-form-item均有效 -->
                        <el-button type="primary" icon="edit" :style="{display: ''}" @click="ona"></el-button>
                    </el-col>
                </el-form-item>
                <el-form-item label="b">
                    <el-col :span="6">
                        {{show.b}}
                    </el-col>
                    <el-col :span="6">
                        <!-- :style="{visibility: 'hidden'}" 对el-button、el-form-item均有效 -->
                        <el-button type="primary" icon="edit" :style="{visibility: ''}" @click="onb"></el-button>
                    </el-col>
                </el-form-item>
                <el-form-item label="c">
                    <el-col :span="6">
                        {{show.c}}
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" icon="edit" @click="onc"></el-button>
                    </el-col>
                </el-form-item>
                <el-form-item label="d">
                    <el-col :span="6">
                        {{show.d}}
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" icon="edit" @click="ond"></el-button>
                    </el-col>
                </el-form-item>
                <el-form-item label="e">
                    <el-col :span="6">
                        {{show.e}}
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" icon="edit" @click="one"></el-button>
                    </el-col>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>
<script>
export default {
    name: 'test',
    computed:{
        b(){
            return this.a + '!'
        }
    },
    data(){
        return{
            show:{
                a: true,
                b: true,
                c: false,
                d: '',
                e: ''
            },
            a: 'Hello World',
        }
    },
    methods: {
        ona() {
            this.show.a = !this.show.a
        },
        onb() {
            this.show.b = !this.show.b
        },
        onc() {
            this.show.c = !this.show.c
        },
        ond() {
            if(this.show.d === 'none'){
                this.show.d = ''
            }else{
                this.show.d = 'none'
            }
        },
        one(){
            if(this.show.e === 'hidden'){
                this.show.e = ''
            }else{
                this.show.e = 'hidden'
            }
        }
    }
}
</script>