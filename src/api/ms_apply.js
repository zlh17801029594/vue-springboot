import request from '@/utils/request'

export function createApply(data){
    return request({
        url: '/apply/create',
        method: 'post',
        data
    })
}

export function getAllApply(){
    return request({
        url: '/apply/all',
        method: 'get',
    })
}

export function getApply(){
    return request({
        url: '/apply',
        method: 'get',
    })
}

export function passApply(id){
    return request({
        url: `/apply/pass/${id}`,
        method: 'post'
    })
}

export function denyApply(id){
    return request({
        url: `/apply/deny/${id}`,
        method: 'post',
    })
}