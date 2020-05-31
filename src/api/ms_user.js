import request from '@/utils/request'

export function getAllUser(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

export function getUser(id) {
  return request({
    url: `/user/${id}`,
    method: 'get'
  })
}

export function getUserBy() {
  return request({
    url: `/user/by`,
    method: 'get'
  })
}
