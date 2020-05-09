import { request } from "./require"

export function loginCheck(a, b) {
    return request({
        url: '/login',
        data: {
            username: a,
            password: b
        },
        method: 'post'
    })
}