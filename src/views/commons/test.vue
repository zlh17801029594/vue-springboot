<template>
  <div>
    <input v-model="text" />
    <input v-model="text" />
    <textarea>输入的值为: {{text}}</textarea>
    <button @click="change">change</button>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        text: "xiaozhou",
        i: 0
      }
    },
    methods: {
      change(){
        this.text = ++this.i
      }
    }
  }
</script>
