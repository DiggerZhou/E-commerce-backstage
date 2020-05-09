import { request } from './require'

export function getUserInfoById(id) {
    return request({
        url: `users/${id}`,
        params: {
            id
        }

    })
}