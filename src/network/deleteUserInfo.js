import { request } from './require'

export function deleteUserInfo(id) {
    return request({
        url: `users/${id}`,
        id:id,
        method:'delete'
    })
}