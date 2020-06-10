import request from '@/utils/request'

export function getFixm() {
  return request({
    url: '/fixm/list',
    method: 'get'
  })
}

export function updateFixmLeaf(id, data) {
  return request({
    url: `/fixm/leaf/${id}`,
    method: 'post',
    data
  })
}

export function updateFixmNoLeafLabel(data) {
  return request({
    url: '/fixm/noleaf/label',
    method: 'post',
    data
  })
}

export function delFixm(data) {
  return request({
    url: '/fixm/del',
    method: 'post',
    data
  })
}
