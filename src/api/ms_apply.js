import request from '@/utils/request'

export function createApply(data) {
  return request({
    url: '/apply/create',
    method: 'post',
    data
  })
}

export function getAllApply(data) {
  return request({
    url: '/apply/list',
    method: 'post',
    data
  })
}

export function getAllApplyByUser(data) {
  return request({
    url: '/apply/user/list',
    method: 'post',
    data
  })
}

export function getApply() {
  return request({
    url: '/apply',
    method: 'get'
  })
}

export function delApply(id) {
  return request({
    url: `/apply/del/${id}`,
    method: 'post'
  })
}

export function passApply(id) {
  return request({
    url: `/apply/pass/${id}`,
    method: 'post'
  })
}

export function passApplySome(data) {
  return request({
    url: `/apply/pass-some-api`,
    method: 'post',
    data
  })
}

export function denyApply(id) {
  return request({
    url: `/apply/deny/${id}`,
    method: 'post'
  })
}
