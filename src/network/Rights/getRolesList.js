import { request } from "../require";

export function getRolesList(){
    return request({
        url:'roles'
    })
}