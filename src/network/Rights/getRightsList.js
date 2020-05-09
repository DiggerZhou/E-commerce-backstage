import { request } from "../require";

export function getRightsList(){
    return request({
        url:'rights/list'
    })
}