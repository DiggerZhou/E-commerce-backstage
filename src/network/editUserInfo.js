import { request } from './require'

export function editUserInfo(id,email,mobile) {
    return request({
        url: `users/${id}`,
        data: {
            id:id,
            email:email,
            mobile:mobile
        },
        method:'put'

    })
}