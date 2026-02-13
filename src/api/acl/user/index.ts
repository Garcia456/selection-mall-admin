// 用户管理模块的接口
import request from "../../../utils/request";
import type { AllRoleResponseData, SetRoleData, User, UserResponseData } from "./type";
// 枚举地址
export const API = {
  // 全部用户账号信息
  ALLUSER_URL : '/admin/acl/user/',
  // 添加新的用户账号
  ADDUSER_URL : '/admin/acl/user/save',
  // 更新已有的用户账号
  UPDATEUSER_URL : '/admin/acl/user/update',
  // 获取全部职位和当前账号已有职位
  ALLROLE_URL : '/admin/acl/user/toAssign/',
  // 给已有用户分配角色
  SETROLE_URL : '/admin/acl/user/doAssignRole',
  // 删除某一个账号的信息
  DELETEUSER_URL : '/admin/acl/user/remove/',
  // 批量删除账号信息
  DELETEALLUSER_URL : '/admin/acl/user/batchRemove'
} as const

// 获取用户账号信息的请求
export const reqUserInfo = (page: number, limit: number, username: string) => request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}?username=${username}`)
// 添加用户与更新已有用户的请求
export const reqAddUserOrUpdateUser = (data: User) => {
  if(data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}
// 获取全部职位和当前账号已有职位的请求
export const reqAllRole = (userId: number) => request.get<any, AllRoleResponseData>(API.ALLROLE_URL + userId)
// 分配职位的请求
export const reqSetUserRole = (data: SetRoleData) => request.post<any, any>(API.SETROLE_URL, data)
// 删除单个账号的请求
export const reqRemoveUser = (userId: number) => request.delete<any, any>(API.DELETEUSER_URL + userId)
// 批量删除账号的请求
export const reqSelectUser = (idList: number[]) => request.delete<any, any>(API.DELETEALLUSER_URL, {data: idList})