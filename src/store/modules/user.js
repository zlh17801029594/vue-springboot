import { login, logout, getInfo, findMenus, findMenuList } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
/*import Layout from '@/layout'
import Vue from 'vue'*/
import {operate} from '@/utils/menus'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  menus: [],
  menuList: [],
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENUS: (state, menus) =>{
    state.menus = menus
  },
  SET_MENULIST: (state, menuList) =>{
    state.menuList = menuList
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        // 去除获取用户信息报错提示
        // reject(error)
      })
    })
  },

  findMenus({commit}){
    return new Promise((resolve, reject) => {
      findMenus().then(response => {
        const { data } = response
        var menus = operate(data)
        //console.log(menus)
        commit('SET_MENUS', menus)
        //console.log(menus)
        resolve(menus)
      }).catch(error => {
        reject(error)
      })
    })
  },
  findMenuList({commit}){
    return new Promise((resolve, reject) => {
      findMenuList().then(response => {
        const { data } = response
        commit('SET_MENULIST', data)
        //console.log(menus)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  setStoreToken({commit}, session) {
    return new Promise(resolve => {
      commit('SET_TOKEN', session)
      setToken(session)
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}
/*
function operate(data) {
  var json = JSON.parse(data)
  var getRouter = filterAsyncRouter(json)
  return getRouter
  //return json
}
function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {//Layout组件特殊处理
        route.component = Layout
      } else if (route.component === 'component') {
        //route.component = _import(route.component)
        route.component = Vue.component(route.name, {template: '<div id=' + route.destination+ ' align="center"></div>', data: function(){
            var websocket = null;
            var col = [];
            var flag = true;
            if('WebSocket' in window){
              websocket = new WebSocket("ws://localhost:8888/websocket/"+ route.destination);
            } else {
              alert('Not support WebSocket');
            }

            websocket.onerror = function(){
              console.log("error");
              //setMessageInnerHTML("error");
            };
            websocket.onopen = function(event){
              console.log("open");
              //setMessageInnerHTML("open");
            };
            websocket.onmessage = function(event){
              // console.log(event)
              //setMessageInnerHTML(JSON.parse(event.data));
              // setMessageInnerHTML(event.data);
              if (document.getElementById(route.destination)) {
                console.log(event.data);
                if (route.type === 'table') {
                  var render = JSON.parse(event.data);
                  if (col.length === 0) {
                    col = converter1(route.meta.title, render[0], route.destination);
                  }
                  converter2(col, render);
                  // converter(render);
                } else if (route.type === 'text') {
                  if (flag) {
                    var table = document.createElement("table");
                    table.id = "table";
                    table.border = 1;
                    var caption = table.createCaption();
                    caption.innerText = route.meta.title;
                    var tbody = table.createTBody();
                    tbody.id = "data";
                    document.getElementById(route.destination).appendChild(table);
                    flag = false;
                  }
                  var tbody = document.getElementById("data");
                  var tr = tbody.insertRow(0);
                  var tabCell = tr.insertCell();
                  var textarea1 = document.createElement("xmp");
                  textarea1.innerHTML = event.data;
                  tabCell.appendChild(textarea1);
                  //tabCell.innerHTML = event.data;
                  //setMessageInnerHTML(event.data);
                }
              }

            };
            websocket.onclose = function(event){
              console.log("close");
              //setMessageInnerHTML("close");
              closeWebSocket();
            };
            function setMessageInnerHTML(data){
              document.getElementById(route.destination).innerHTML +=data + '<br/>';
              console.log(data);
            }
            function closeWebSocket(){
              websocket.close();
            }
            function send(msg) {
              websocket.send(msg);
            }
            /!*this.$router.afterEach(function(){
                      console.log("close2");
                      websocket.close();
                  })*!/
            this.over = () => {
              console.log("close3");
              closeWebSocket();
            }
            return {
              count: 0
            };
          },
          beforeDestroy () {
            this.over()
          }});
      } else {
        route.component = Vue.component(route.name, {template: '<div><router-view /></div>'});
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })

  return accessedRouters
}

function converter1(captionStr, obj, idName){
  var col = [];
  for (var key in obj){
    col.push(key);
  }
  console.log(col);
  console.log(col.length);
  var table = document.createElement("table");
  table.id = "table";
  table.border = 1;
  var caption = table.createCaption();
  caption.innerText = captionStr;
  var thead = table.createTHead();
  var tr = thead.insertRow(-1);
  //var tr = table.insertRow(-1);
  for (var i=0;i<col.length;i++){
    var th = document.createElement("th");
    th.innerHTML = col[i];
    tr.appendChild(th);
  }
  var tbody = table.createTBody();
  tbody.id = "data";
  document.getElementById(idName).appendChild(table);
  return col;
}

function converter2(col, render){
  var tbody = document.getElementById("data");
  for(var i=0;i<render.length;i++){
    var tr = tbody.insertRow(0);
    for(var j=0;j<col.length;j++){
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = render[i][col[j]];
    }
  }
}*/

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
