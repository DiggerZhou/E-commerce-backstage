import {request} from './require'

export function getUserList(queryInfo){
    return request({
        url:'/users',
        params:queryInfo
    })
}