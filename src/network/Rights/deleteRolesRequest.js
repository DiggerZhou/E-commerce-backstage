import { request } from "../require";

export function deleteRolesRequest(id) {
    return request({
        url: `roles/${id}`,
        method: 'delete'
    })
}