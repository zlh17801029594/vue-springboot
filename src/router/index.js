import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },

  /* {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },*/
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/commons/index'),
        name: 'index',
        meta: { title: '首页', icon: 'guide', affix: true }
      }
    ]
  }
  /* {
    path: '/',
    component: Layout,
    redirect: '/documentation',
    children: [
      {
        path: '/documentation',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'Documentation', icon: 'documentation', affix: true }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'Guide', icon: 'guide', noCache: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }*/
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes1 = [
  {
    path: '/ms_api',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'maintain-permission',
        component: () => import('@/views/commons/admin/ms_api'),
        meta: {
          title: '接口管理',
          icon: 'component',
          roles: ['SUPER_ADMIN', 'ADMIN']
        }
      }
    ]
  },
  {
    path: '/ms_user',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'approve',
        component: () => import('@/views/commons/admin/ms_user'),
        meta: {
          title: '用户管理',
          icon: 'component',
          roles: ['SUPER_ADMIN', 'ADMIN']
        }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/commons/admin/user_api'),
        name: 'editUserApi',
        meta: { title: '用户接口管理', noCache: true, activeMenu: '/ms_user/index' },
        hidden: true
      }
    ]
  },
  // {
  //   path: '/ms_apply_tabs',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'ms_apply_tabs',
  //       component: () => import('@/views/commons/ms_apply_tabs'),
  //       meta: {title: '申请审批', icon: 'component'}
  //     }
  //   ]
  // },
  {
    path: '/ms_apply_select',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'ms_apply_select',
        component: () => import('@/views/commons/ms_apply_select'),
        meta: { title: '申请审批', icon: 'component' }
      }
    ]
  },
  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/fixm',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/commons/admin/fixm_tabs'),
  //       name: 'fixm',
  //       meta: {
  //         title: 'FIXM管理',
  //         icon: 'component'
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: '/fixm_test',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/commons/admin/fixm_ztree_subversion'),
  //       name: 'fixm_test',
  //       meta: {
  //         title: 'FIXM子版本演示',
  //         icon: 'component'
  //       }
  //     }
  //   ]
  // },

  {
    path: '/fixm_menutree',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/commons/admin/fixm_menutree'),
        name: 'fixm_menutree',
        meta: {
          // title: 'FIXM子版本tree菜单',
          title: 'FIXM管理',
          icon: 'component'
        }
      }
    ]
  },
  // nestedRouter,

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
  { path: '*', redirect: '/', hidden: true }
]

export const asyncRoutes2 = [
  {
    path: '/user_api_one',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'user_api_one',
        component: () => import('@/views/commons/user/user_api_one'),
        meta: {
          title: '用户接口',
          icon: 'component'
        }
      }
    ]
  },
  {
    path: '/user_apply-for',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'user_apply-for',
        component: () => import('@/views/commons/user/apply-for'),
        meta: { title: '接口申请', icon: 'component' }
      }
    ]
  },
  {
    path: '/user_apply_tabs',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'user_apply_tabs',
        component: () => import('@/views/commons/user/apply_tabs'),
        meta: { title: '申请记录', icon: 'component' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
  { path: '*', redirect: '/', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
