import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function findMenus() {
  return request({
    url: '/user/menus',
    method: 'get'
  })
}

export function findMenuList() {
  return request({
    url: '/user/menulist',
    method: 'get'
  })
}

export function createMenu(data){
  return request({
    url: '/user/menu',
    method: 'post',
    data
  })
}

export function updateMenu(id, data){
  return request({
    url: '/user/menu/' + id,
    method: 'put',
    data
  })
}

export function deleteMenus(data) {
  return request({
    url: '/user/menu',
    method: 'delete',
    data
  })
}

export function exchangeMenu(data) {
  return request({
    url: '/user/exchangeMenu',
    method: 'put',
    data
  })
}

export function getService() {
  return request({
    url: '/service',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
