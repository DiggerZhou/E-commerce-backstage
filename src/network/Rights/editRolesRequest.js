import { request } from "../require";

export function editRolesRequest(id,roleName,roleDesc) {
    return request({
        url: `roles/${id}`,
        method: 'put',
        data:{
            id,
            roleName,
            roleDesc
        }
    })
}