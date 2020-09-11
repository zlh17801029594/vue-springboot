import request from '@/utils/request'

export function getFixm(version) {
  return request({
    url: `/fixmlogic/${version}/list`,
    method: 'get'
  })
}

export function addFixm(version, data) {
  return request({
    url: `/fixmlogic/${version}`,
    method: 'post',
    data
  })
}

export function updateFixm(version, data) {
  return request({
    url: `/fixmlogic/${version}`,
    method: 'put',
    data
  })
}

export function updateFixmName(version, data) {
  return request({
    url: `/fixmlogic/${version}/name`,
    method: 'put',
    data
  })
}

export function drawFixm(version, data) {
  return request({
    url: `/fixmlogic/${version}/draw`,
    method: 'put',
    data
  })
}

export function delFixm(version, data) {
  return request({
    url: `/fixmlogic/${version}`,
    method: 'delete',
    data
  })
}

export function keys(version) {
  return request({
    url: `/fixmlogic/${version}/keys`,
    method: 'get'
  })
}

export function map(version) {
  return request({
    url: `/fixmlogic/${version}/map`,
    method: 'get'
  })
}

export function uploadValidateFile(version, data) {
  return request({
    url: `/fixmlogic/${version}/uploadValidateFile`,
    method: 'post',
    data
  })
}

export function validateFiles(version) {
  return request({
    url: `/fixmlogic/${version}/validateFiles`,
    method: 'get'
  })
}

export function getValidateMapValue(version) {
  return request({
    url: `/fixmlogic/${version}/getValidateMapValue`,
    method: 'get'
  })
}

export function updateValidateMap(version, data) {
  return request({
    url: `/fixmlogic/${version}/updateValidateMap`,
    method: 'post',
    data
  })
}

export function validateFixm(version) {
  return request({
    url: `/fixmlogic/${version}/validate`,
    method: 'get'
  })
}

export function fixmVersions() {
  return request({
    url: '/fixm/versions',
    method: 'get'
  })
}

export function delFixmByVersion(version) {
  return request({
    url: `/fixm/${version}`,
    method: 'delete'
  })
}

export function fixmSubversions() {
  return request({
    url: '/fixm/subversions',
    method: 'get'
  })
}

export function updateSubversion(version, subversion, xsdnodes) {
  return request({
    url: `/fixmlogic/${version}/subversion/${subversion}`,
    method: 'post',
    data: xsdnodes
  })
}

export function delSubversion(version, subversion) {
  return request({
    url: `/fixmlogic/${version}/subversion/${subversion}`,
    method: 'delete'
  })
}
