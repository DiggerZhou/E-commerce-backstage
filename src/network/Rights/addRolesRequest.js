import { request } from "../require";

export function addRolesRequest(roleName,roleDesc){
    return request({
        url:'roles',
        data:{
            roleName,
            roleDesc
        },
        method:'post'
    })
}