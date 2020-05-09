import {request} from './require'

export function navigationList(){
    return request({
        url:'/menus'

    })
}