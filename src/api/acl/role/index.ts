import request from "../../../utils/request";
import type { MenuResponseData, RoleData, RoleResponseData } from "./type";
export const API = {
  // 获取角色分页列表
  ALLROLE_URL : '/admin/acl/role/',
  // 添加角色
  ADDROLE_URL : '/admin/acl/role/save',
  // 更新角色
  UPDATEROLE_URL : '/admin/acl/role/update',
  // 获取分配角色全部的菜单与按钮数据
  ALLPERMISSION_URL : '/admin/acl/permission/toAssign/',
  // 分配权限
  SETPERMISSION_URL : '/admin/acl/permission/doAssign',
  // 删除已有的职位
  REMOVEROLE_URL : '/admin/acl/role/remove/'
} as const

// 获取角色分页列表的请求
export const reqAllRoleList = (page: number, limit: number, roleName: string) => request.get<any, RoleResponseData>(API.ALLROLE_URL + `${page}/${limit}?roleName=${roleName}`)
// 添加或更新角色的请求
export const reqAddOrUpdateRole = (data: RoleData) => {
  if(data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}
// 获取根据角色的权限菜单的请求
export const reqAllMenuList = (roleId: number) => request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + roleId)
// 给相应的职位下发权限的请求
export const reqSetPermission = (roleId: number, permissionId: number[]) => request.post<any, any>(API.SETPERMISSION_URL + `?roleId=${roleId}&permissionId=${permissionId}`)
// 删除已有职位的请求
export const reqRemoveRole = (roleId: number) => request.delete<any, any>(API.REMOVEROLE_URL + roleId)