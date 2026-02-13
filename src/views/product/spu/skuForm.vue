<template>
  <el-form label-width="80px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName" />
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" v-model="skuParams.price" />
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input placeholder="重量(g)" v-model="skuParams.weight" />
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input label="SKU描述" type="textarea" v-model="skuParams.skuDesc" />
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form label-width="80px" :inline="true">
        <el-form-item v-for="item1 in attrArr" :label="item1.attrName">
          <el-select placeholder="请选择" style="width: 200px;" v-model="item1.attrIdAndValueId">
            <el-option v-for="item2 in item1.attrValueList" :label="item2.valueName"
              :value="`${item1.id}:${item2.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form label-width="80px" :inline="true">
        <el-form-item v-for="item1 in saleAttr" :label="item1.saleAttrName">
          <el-select style="width: 200px;" v-model="item1.saleIdAndValueId">
            <el-option v-for="item2 in item1.spuSaleAttrValueList" :label="item2.saleAttrValueName" :key="item2.id"
              :value="`${item1.id}:${item2.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgList" ref="table">
        <el-table-column width="80px" align="center" type="selection"></el-table-column>
        <el-table-column label="图片">
          <template #="{ row }">
            <img :src="row.imgUrl" :alt="row.imgName" style="width: 100px; height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button type="warning" size="default" @click="handler(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="default" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { reqAttr } from '../../../api/product/attr'
import type { SaleAttr, SkuData, SpuData, SpuImg } from '../../../api/product/spu/type'
import type { AttrList } from '../../../api/product/attr/type'
import { reqAddSku, reqSpuHasSaleAttr, reqSpuImageList } from '../../../api/product/spu'
import { ElMessage } from 'element-plus'
const $emit = defineEmits(['changeScene'])

const attrArr = ref<AttrList>([])
const saleAttr = ref<SaleAttr[]>([])
const imgList = ref<SpuImg[]>([])
// 表格实例
const table = ref<any>()
// 收集SKU的参数
let skuParams = reactive<SkuData>({
  category3Id: '',
  spuId: '',
  tmId: '',
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '',
})

const cancel = () => {
  $emit('changeScene', { flag: 0, param: '' })
}

const initSkuData = async (spu: SpuData, c1Id: number, c2Id: number) => {
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id!
  skuParams.tmId = spu.tmId
  const result1 = await reqAttr(c1Id, c2Id, spu.category3Id)
  const result2 = await reqSpuHasSaleAttr((spu.id as number))
  const result3 = await reqSpuImageList((spu.id as number))

  attrArr.value = result1.data
  saleAttr.value = result2.data
  imgList.value = result3.data
}

// 设置默认按钮的回调
const handler = (row: any) => {
  // 复选框全部不勾选
  imgList.value.forEach(item => {
    table.value.toggleRowSelection(item, false)
  })
  table.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl

}

// 保存按钮的回调
const save = async () => {
  // 整理参数
  // 平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      const [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId: Number(attrId),
        valueId: Number(valueId)
      })
    }
    return prev
  }, [])
  // 销售属性
  skuParams.skuSaleAttrValueList = saleAttr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      const [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
      prev.push({
        saleAttrId: Number(saleAttrId),
        saleAttrValueId: Number(saleAttrValueId)
      })
    }
    return prev
  }, [])
  // 发请求
  const result = await reqAddSku(skuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功'
    })
    skuParams = {
      category3Id: '',
      spuId: '',
      tmId: '',
      skuName: '',
      price: '',
      weight: '',
      skuDesc: '',
      skuAttrValueList: [],
      skuSaleAttrValueList: [],
      skuDefaultImg: '',
    }
    // 切换场景
    $emit('changeScene', { flag: 0, param: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加SKU失败'
    })
  }
}

defineExpose({ initSkuData })
</script>

<style scoped></style>