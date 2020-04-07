import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, setToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

const xxl_sso_sessionid = getQueryVariable('xxl_sso_sessionid')

if(xxl_sso_sessionid){
  setToken(decodeURIComponent(xxl_sso_sessionid))
}


router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // console.log(store.getters.menus)
          // 数据引接
          // const menus = await store.dispatch('user/findMenus')
          // 服务申请
          const menus = []
          // console.log(store.getters.menus)

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', {roles, menus})

          /*console.log(accessRoutes)
          const formatRouter = (accessRoutes, newRoutes = []) => {
            accessRoutes.map(item => {
              if (item.children && item.children.length > 0){
                formatRouter(item.children, newRoutes)
              }
              newRoutes.push(item)
            })
            return newRoutes
          }
          let singleRoutes = formatRouter(accessRoutes)
          router.addRoutes(singleRoutes)*/

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          // next(`/login?redirect=${to.path}`)
          window.location.href = 'http://192.168.204.67:8085/login?redirect_url=http://192.168.243.87:9527'
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      window.location.href = 'http://192.168.204.67:8085/login?redirect_url=http://192.168.243.87:9527'
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})


function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}