import { request } from './require'

export function addNewUser(addForm) {
    return request({
        url: '/users',
        data:addForm,
        method:'post'
    })
}