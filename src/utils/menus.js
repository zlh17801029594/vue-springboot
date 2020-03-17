import Vue from 'vue'
import Layout from '@/layout'
import menus from '@/views/commons/menus'
import routeview from '@/views/commons/routeview'
let str = 'component'
let i = 0
let cacheNum
let requestUrl

export function operate(data) {
  let json = JSON.parse(data)
  cacheNum = json.cacheNum
  requestUrl = json.requestUrl
  console.log("cacheNum", cacheNum)
  let getRouter = filterAsyncRouter(json.menus)
  return getRouter
}
export function filterAsyncRouter(asyncRouterMap) {

  const accessedRouters = asyncRouterMap.filter(route => {
    let componentId = str + i++
    // console.log(componentId)
    if (route.component) {
      if (route.component === 'Layout') {//Layout组件特殊处理
        route.component = Layout
      } else if (route.component === 'leaf') {
        route.component = Vue.component(route.name, {
          template: '<menus ref="menus" :route="route" :cacheNum="cacheNum" :requestUrl="requestUrl"></menus>',
          data: function(){
            return{
              route: route,
              cacheNum: cacheNum,
              requestUrl: requestUrl
            }
          },
          components: {
            menus
          },
          beforeRouteEnter(to, from, next){
            next(vm => {
              // vm.initWebsocket()
              vm.$refs.menus.initWebsocket()
            })
          },
          beforeRouteLeave(to, from, next){
            // this.over()
            this.$refs.menus.over()
            console.log(this)
            next()
          },
          beforeCreate() {
            console.log("beforeCreate: ", route.name)
          },
          created() {
            console.log("created: ", route.name)
          },
          beforeMount() {
            console.log("beforeMount: ", route.name)
          },
          mounted() {
            console.log("mounted: ", route.name)
          },
          beforeUpdate() {
            console.log("beforeUpdate: ", route.name)
          },
          updated() {
            console.log("updated: ", route.name)
          },
          activated() {
            console.log("activated: ", route.name)
          },
          deactivated() {
            console.log("deactivated: ", route.name)
          },
          beforeDestroy() {
            console.log("beforeDestroy: ", route.name)
          },
          destroyed() {
            console.log("destroyed: ", route.name)
          }
        })
      } else if (route.component === 'noleaf') {
        route.component = Vue.component(route.name, {
          template: '<routeview />',
          components: {
            routeview
          }
        });
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })

  return accessedRouters
}
