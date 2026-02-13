import request from "../../../utils/request";
import type { AllTradeMark, HasSpuResponseData, SaleAttrResponseData, SpuHasImg, HasSaleAttrResponseData, SpuData, SkuData, SkuInfoData } from "./type";

export const API = {
  // 获取已有的SPU数据
  HASSPU_URL : '/admin/product/',
  // 获取全部品牌的数据
  ALLTRADEMARK_URL : '/admin/product/baseTrademark/getTrademarkList',
  // 获取某个SPU下全部的售卖商品的图片数据
  IMAGE_URL : '/admin/product/spuImageList/',
  // 获取某一个SPU下全部的已有的销售属性接口地址
  SPUHASSALEATTR_URL : '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部的销售属性[颜色、版本、尺码]
  ALLSALEATTR_URL : '/admin/product/baseSaleAttrList',
  // 追加一个新的SPU
  ADDSPU_URL : '/admin/product/saveSkuInfo',
  // 更新已有的SPU
  UPDATESPU_URL : '/admin/product/updateSpuInfo',
  // 追加一个新增的SKU地址
  ADDSKU_URL : '/admin/product/saveSkuInfo',
  // 查看某一个已有的SPU下全部售卖的商品
  SKUINFO_URL : '/admin/product/findBySpuId/',
  // 删除某个SPU
  REMOVESPU_URL : '/admin/product/deleteSku/'
} as const

// 获取某一三级分类已有的SPU数据
export const reqHasSpu = (page: number, limit: number, category3Id: number | string) => request.get<any, HasSpuResponseData>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)
// 获取全部的SPU品牌的数据
export const reqAllTradeMark = () => request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)
// 获取某一个已有的SPU下全部商品的图片地址
export const reqSpuImageList = (spuId: number) => request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)
// 获取某一个已有的SPU拥有多少个销售属性
export const reqSpuHasSaleAttr = (spuId: number) => request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)
// 获取全部的销售属性
export const reqAllSaleAttr = () => request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
// 添加一个新的SPU/更新已有的SPU
// data即为新增的SPU/已有的SPU对象
export const reqAddOrUpdateSpu = (data: SpuData) => {
  if(data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}
// 添加SKU
export const reqAddSku = (data: SkuData) => request.post<any, any>(API.ADDSKU_URL, data)
// 获取SKU
export const reqSkuList = (spuId: number | string) => request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)
// 删除SPU
export const reqRemoveSpu = (spuId: number | string) => request.delete<any, any>(API.REMOVESPU_URL + spuId)