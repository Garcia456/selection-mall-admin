// 属性相关的API文件
import request from "../../../utils/request";
import type { AttrResponseData, CategoryResponseData, Attr } from "./type";

// 属性管理模块接口地址
export const API = {
  // 获取一级、二级和三级分类接口地址
  C1_URL : "/admin/product/getCategory1",
  C2_URL : "/admin/product/getCategory2/",
  C3_URL : "/admin/product/getCategory3/",
  // 获取分类下已有的属性与属性值
  ATTR_URL : "/admin/product/attrInfoList/",
  // 添加或修改已有的属性的接口
  ADDORUPDATEATTR : '/admin/product/saveAttrInfo',
  // 删除某一已有属性
  DELETEATTR_URL : '/admin/product/deleteAttr/'
} as const

// 获取一级分类的接口方法
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL);
// 获取二级分类的接口方法
export const reqC2 = (category1Id: number | string) => request.get<any, CategoryResponseData>(API.C2_URL + category1Id)
// 获取三级分类的接口方法
export const reqC3 = (category2Id: number | string) => request.get<any, CategoryResponseData>(API.C3_URL + category2Id)
// 获取对应分类下已有的属性与属性值方法
export const reqAttr = (category1Id: number | string, category2Id: number | string, category3Id: number | string) => request.get<any, AttrResponseData>(API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`)
// 新增或修改已有的属性接口
export const addOrUpdateAttr = (data: Attr) => request.post<any, any>(API.ADDORUPDATEATTR, data)
// 删除已有的属性业务接口
export const reqRemoveAttr = (attrId: number) => request.delete<any, any>(API.DELETEATTR_URL + attrId)