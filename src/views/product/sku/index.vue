<template>
  <el-card>
    <el-table border style="margin: 10px 0px;" :data="skuArr">
      <el-table-column label="序号" type="index" width="100px" align="center"></el-table-column>
      <el-table-column label="名称" width="250px" show-overflow-tooltip prop="skuName"></el-table-column>
      <el-table-column label="描述" width="250px" show-overflow-tooltip prop="skuDesc"></el-table-column>
      <el-table-column label="图片" width="250px" v-slot="{ row }">
        <img :src="row.skuDefaultImg" style="width: 100px; height: 100px;">
      </el-table-column>
      <el-table-column label="重量" width="250px" prop="weight"></el-table-column>
      <el-table-column label="价格" width="250px" prop="price"></el-table-column>
      <el-table-column label="操作" width="350px" fixed="right">
        <template #="{ row }">
          <el-button :type="row.isSale == 1 ? 'success' : 'info'" size="small"
            :icon="row.isSale == 1 ? 'Top' : 'Bottom'" title="SKU" @click="updateSale(row)" />
          <el-button type="primary" size="small" icon="Edit" title="更新SKU" @click="updateSku" />
          <el-button type="info" size="small" icon="InfoFilled" title="查看SKU" @click="skuDetail(row)" />
          <el-popconfirm width="200px" :title="`确定删除${row.skuName}吗？`" @confirm="removeSku(row)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete" title="删除SPU" />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
      :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
      @size-change="handleSizeChange" @current-change="getHasSku" />
    <!-- 抽屉 -->
    <el-drawer v-model="drawer" direction="rtl">
      <template #header>
        <h4>商品详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">商品名称</el-col>
          <el-col :span="18">{{ drawerShow.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">商品描述</el-col>
          <el-col :span="18">{{ drawerShow.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">商品价格</el-col>
          <el-col :span="18">{{ drawerShow.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in drawerShow.skuAttrValueList" style="margin-right: 10px;" :key="item.id">{{
              item.valueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in drawerShow.skuSaleAttrValueList" style="margin-right: 10px;" :key="item.id">{{
              item.saleAttrValueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in drawerShow.skuImageList" :key="item">
                <img :src="item.imgUrl" style="width: 100%; height: 100%;">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { SkuData, SkuInfoData, SkuResponseData } from '../../../api/product/sku/type';
import { reqCancelSaleSku, reqRemoveSku, reqSaleSku, reqSkuInfo, reqSkuList } from '../../../api/product/sku';
import { ElMessage } from 'element-plus';

const pageNo = ref<number>(1)
const pageSize = ref<number>(10)
const total = ref<number>(0)
const skuArr = ref<SkuData[]>([])
const drawer = ref<boolean>(false)
const drawerShow = ref<any>({})
// 组件挂载完毕
onMounted(() => getHasSku())

const getHasSku = async (pager = 1) => {
  pageNo.value = pager
  const result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}
const handleSizeChange = (pageSize: number) => {
  getHasSku(pageSize)
}

// 上架/下架按钮的回调
const updateSale = async (row: SkuData) => {
  if (row.isSale == 1) {
    // 下架操作
    const result: any = await reqCancelSaleSku(row.id)
    if (result.code == 200) {
      ElMessage({
        type: 'success',
        message: '下架成功'
      })
    } else {
      ElMessage({
        type: 'error',
        message: '下架失败'
      })
    }
  } else {
    // 上架操作
    const result: any = await reqSaleSku(row.id)
    if (result.code == 200) {
      ElMessage({
        type: 'success',
        message: '上架成功'
      })
    } else {
      ElMessage({
        type: 'error',
        message: '上架失败'
      })
    }
  }
  getHasSku(pageNo.value)
}

// 更新SKU按钮的回调
const updateSku = () => {
  ElMessage({
    type: 'success',
    message: '程序员在努力更新中......'
  })
}

// 查看SKU详情的回调
const skuDetail = async (row: SkuData) => {
  drawer.value = true
  const result: SkuInfoData = await reqSkuInfo(row.id)
  drawerShow.value = result.data
}

// 删除SKU的回调
const removeSku = async (row: SkuData) => {
  const result: any = await reqRemoveSku(row.id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败，' + result.message
    })
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>