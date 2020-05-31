import request from '@/utils/request'

export function getUserApi(userId) {
  return request({
    url: `/user-api/user/${userId}`,
    method: 'get'
  })
}

export function getUserApiByUser() {
  return request({
    url: `/user-api/user`,
    method: 'get'
  })
}

export function onUserApi(data) {
  return request({
    url: '/user-api/on',
    method: 'post',
    data
  })
}

export function offUserApi(data) {
  return request({
    url: '/user-api/off',
    method: 'post',
    data
  })
}

export function delUserApi(data) {
  return request({
    url: '/user-api/del',
    method: 'post',
    data
  })
}
