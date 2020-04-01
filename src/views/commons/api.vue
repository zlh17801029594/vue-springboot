<template>
  <div class="app-container">
    <p>{{data}}</p>
  </div>
</template>

<script>
  import {getApi} from '@/api/user'
  import {getToken} from '@/utils/auth'
  export default {
    name: "api",
    data() {
      return {
        data: ''
      }
    },
    methods: {
      
    },
    created() {
      getApi(getToken()).then(response => {
        this.data = response.data
        console.log(response.data)
      })
    }
  }
</script>

<style>
  
</style>
