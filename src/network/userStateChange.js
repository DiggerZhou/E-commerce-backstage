import {request} from './require'

export function userStateChange(uid,type){
    return request({
        url:`users/${uid}/state/${type}`,
        method: 'put'

    })
}