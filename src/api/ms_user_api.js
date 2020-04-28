import request from '@/utils/request'

export function getUserApi(){
    return request({
        url: '/user/all',
        method: 'get'
    })
}

export function onUserApi(data){
    return request({
        url: '/user_api/on',
        method: 'post',
        data
    })
}

export function offUserApi(data){
    return request({
        url: '/user_api/off',
        method: 'post',
        data
    })
}

export function delUserApi(data){
    return request({
        url: '/user_api/del',
        method: 'post',
        data
    })
}
