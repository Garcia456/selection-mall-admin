import request from "../../../utils/request";
import type { MenuParams } from "./type";
export const API = {
  // 获取全部菜单与按钮的标识数据
  ALLPERMISSION_URL : '/admin/acl/permission',
  // 添加菜单
  ADDMENU_URL : '/admin/acl/permission/save',
  // 更新菜单
  UPDATEMENU_URL : '/admin/acl/permission/update',
  // 删除已有的菜单
  DELETEMENU_URL : '/admin/acl/permission/remove/'
} as const

// 获取菜单数据的请求
export const reqAllPermission = () => request.get<any, any>(API.ALLPERMISSION_URL)
// 添加或更新菜单的请求
export const reqAddOrUpdateMenu = (data: MenuParams) => {
  if(data.id) {
    return request.put<any, any>(API.UPDATEMENU_URL, data)
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data)
  }
}
// 删除某一个已有菜单的请求
export const reqRemoveMenu = (id: number) => request.delete<any, any>(API.DELETEMENU_URL + id)