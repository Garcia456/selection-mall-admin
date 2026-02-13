// 服务器全部接口返回数据的类型
export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}

export interface Attr {
  attrId: number | string, // 平台属性ID
  valueId: number | string, // 属性值ID
}
export interface saleArr {
  saleAttrId: number | string, // 属性ID
  saleAttrValueId: number | string, // 属性值ID
}
export interface SkuData {
  category3Id: string | number,
  spuId: string | number,
  tmId: string | number,
  skuName: string,
  price: string | number,
  weight: string | number,
  skuDesc: string,
  skuAttrValueList?: Attr[],
  skuSaleAttrValueList?: saleArr[],
  skuDefaultImg: string,

  isSale?: number,
  id: number
}

// 获取SKU接口返回的数据ts类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[],
    total: number,
    size: number,
    current: number,
    orders: [],
    optimizeCountSql: boolean,
    hitCount: boolean,
    countId: null,
    maxLimit: null,
    searchCount: boolean,
    pages: number
  }
}

// 获取SKU商品详情返回的数据ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData
}