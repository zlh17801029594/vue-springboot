<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="true" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
        <div class="menu-wrapper">
          <el-menu-item><a href="#" @click="back"><svg-icon icon-class="link" /><span slot="title">返回门户</span></a></el-menu-item>
        </div>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

let baseURL = process.env.VUE_APP_BASE_API
if (!baseURL.endsWith('/')) {
  baseURL = baseURL + '/'
}
if (baseURL.startsWith('/')) {
  baseURL = baseURL.substring(baseURL.length - 1)
}

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    back() {
      location.href = baseURL + 'sso/index'
    }
  }
}
</script>
