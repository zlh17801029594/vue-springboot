import request from '@/utils/request'

export function updateService(msUrl) {
    return request({
        url: '/api/update',
        method: 'post',
        params: {msUrl}
    })
}

export function getAllService() {
    return request({
        url: '/api/all',
        method: 'get'
    })
}

export function getServiceDetails(id) {
    return request({
        url: `/api/${id}`,
        method: 'get'
    })
}

export function getService() {
    return request({
        url: '/api',
        method: 'get'
    })
}

export function joinService(data) {
    return request({
        url: '/api/join',
        method: 'post',
        data
    })
}

export function delService(data) {
    return request({
        url: '/api/del',
        method: 'post',
        data
    })
}

export function onService(data) {
    return request({
        url: '/api/on',
        method: 'post',
        data
    })
}

export function offService(data) {
    return request({
        url: '/api/off',
        method: 'post',
        data
    })
}

export function sensitiveService(sensitiveNum, data) {
    return request({
        url: `/api/sensitive/${sensitiveNum}`,
        method: 'post',
        data
    })
}