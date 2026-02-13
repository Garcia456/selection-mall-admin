// SKU模块接口管理
import request from "../../../utils/request";
import type { SkuInfoData, SkuResponseData } from "./type";
// 枚举地址
export const API = {
  // 获取已有的商品的数据-SKU
  SKU_URL : '/admin/product/list/',
  // 上架
  SALE_URL : '/admin/product/onSale/',
  // 下架
  CANCELSALE_URL : '/admin/product/cancelSale/',
  // 商品详情
  SKUINFO_URL : '/admin/product/getSkuInfo/',
  // 删除
  DELETESKU_URL : '/admin/product/deleteSku/',
} as const

// 获取商品SKU的请求
export const reqSkuList = (page: number, limit: number) => request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
// 已有商品上架的请求
export const reqSaleSku = (skuId: number) => request.get<any, any>(API.SALE_URL + skuId)
// 已有商品下架的请求
export const reqCancelSaleSku = (skuId: number) => request.get<any, any>(API.CANCELSALE_URL + skuId)
// 获取商品详情信息的请求
export const reqSkuInfo = (skuId: number) => request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)
// 删除SKU请求
export const reqRemoveSku = (skuId: number) => request.delete<any, any>(API.DELETESKU_URL + skuId)