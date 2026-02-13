<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene" />
    <!-- 表格 -->
    <el-card style="margin: 10px 0;">
      <!-- 已有spu数据展示模块 -->
      <div v-show="scene == 0">
        <el-button type="primary" icon="Plus" size="default" :disabled="!categoryStore.c3Id"
          @click="addSpu">添加SPU</el-button>
        <el-table border style="margin: 10px 0;" :data="records">
          <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName" width="200px" align="center"></el-table-column>
          <el-table-column label="SPU描述" prop="description" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="SPU操作" align="center" width="250px">
            <template #="{ row }">
              <el-button type="primary" size="small" icon="Plus" title="添加SKU" @click="addSku(row)" />
              <el-button type="warning" size="small" icon="Edit" title="修改SPU" @click="updateSpu(row)" />
              <el-button type="info" size="small" icon="InfoFilled" title="查看SPU列表" @click="findSku(row)" />
              <el-popconfirm width="200px" :title="`确定删除${row.spuName}吗？`" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" title="删除SPU" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 10]" background
          layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getHasSpu"
          @size-change="getHasSpu" />
      </div>
      <!-- 添加/修改SPU模块 -->
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu" />
      <!-- 添加SKU模块 -->
      <SkuForm v-show="scene == 2" @changeScene="changeScene" ref="sku" />
      <el-dialog v-model="show" title="SKU列表">
        <el-table :data="skuArr" border>
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row }">
              <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import useCategoryStore from '../../../store/modules/category';
const categoryStore = useCategoryStore()
import { reqHasSpu, reqRemoveSpu, reqSkuList } from '../../../api/product/spu';
import type { Records, HasSpuResponseData, SpuData, SkuData, SkuInfoData } from '../../../api/product/spu/type';

import SkuForm from './skuForm.vue';
import SpuForm from './spuForm.vue';
import { ElMessage } from 'element-plus';

const scene = ref<number>(0)

const pageNo = ref<number>(1)
const limit = ref<number>(3)
const total = ref<number>(100)
const records = ref<Records>([])
const skuArr = ref<SkuData[]>([])
// SpuForm 组件实例
const spu = ref()
// SkuForm 组件实例
const sku = ref()
const show = ref<boolean>(false)
// 监听三级分类ID变化
watch(() => categoryStore.c3Id, () => {
  // 三级分类id不存在就不发请求获取
  if (!categoryStore.c3Id) return
  getHasSpu()
})

// 获取某一个三级分类下全部的已有spu
const getHasSpu = async (pager = 1) => {
  // 当没有传入pageNo参数时，默认第1页
  pageNo.value = pager
  const result: HasSpuResponseData = await reqHasSpu(pageNo.value, limit.value, categoryStore.c3Id)
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
// 添加/修改SPU按钮的回调
const addSpu = () => {
  scene.value = 1
  spu.value.initAddSpu(categoryStore.c3Id)
}
const updateSpu = (row: SpuData) => {
  scene.value = 1
  spu.value.initHasSpuData(row)
}
// 添加SKU按钮的回调
const addSku = (row: SpuData) => {
  scene.value = 2
  sku.value.initSkuData(row, categoryStore.c1Id, categoryStore.c2Id)
}
// 子组件SpuForm绑定的自定义事件的回调
const changeScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.param == 'update') {
    // 更新留在当前页
    getHasSpu(pageNo.value)
  } else {
    // 添加返回第一页
    getHasSpu()
  }
}
// 查看SKU信息按钮的回调
const findSku = async (row: SpuData) => {
  const result: SkuInfoData = await reqSkuList(row.id!)
  if (result.code == 200) {
    skuArr.value = result.data
    show.value = true
  }
}
// 删除SPU按钮的回调
const deleteSpu = async (row: SpuData) => {
  const result = await reqRemoveSpu(row.id!)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
// 路由组件销毁前，清空仓库关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>