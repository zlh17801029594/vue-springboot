<template>
  <div id="app">
    <router-view v-if="alive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return{
      reload: this.reload
    }
  },
  data(){
    return{
      alive: true
    }
  },
  methods:{
    reload(){
      this.alive = false
      this.$nextTick(function(){
        this.alive = true
      })
    }
  }
}
</script>
