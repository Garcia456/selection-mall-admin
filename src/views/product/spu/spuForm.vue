<template>
  <el-form label-width="98px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请输入SPU名称" v-model="spuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌" width="80px">
      <el-select placeholder="请选择SPU品牌" style="width: 200px;" v-model="spuParams.tmId">
        <el-option v-for="item in allTradeMark" :label="item.tmName" :key="item.id" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input placeholder="请输入SPU描述" type="textarea" v-model="spuParams.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
      <!-- 照片墙模块 -->
      <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
        :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handleUpload"
        :headers="headers">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%;" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select style="width: 200px;" v-model="saleAttrIdAndValueName"
        :placeholder="unSelectSaleArr.length ? `还有${unSelectSaleArr.length}个属性未添加` : '无未添加属性'">
        <el-option v-for="item in unSelectSaleArr" :label="item.name" :value="`${item.id}:${item.name}`"
          :key="item.id"></el-option>
      </el-select>
      <el-button icon="Plus" type="primary" style="margin-left: 10px;" :disabled="!saleAttrIdAndValueName"
        @click="addSaleAttr">添加销售属性</el-button>
      <!-- table展示销售属性与属性值的地方 -->
      <el-table border style="margin: 10px 0;" :data="saleAttr">
        <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
        <el-table-column label="属性名" width="100px" prop="saleAttrName"></el-table-column>
        <el-table-column label="属性值" prop="spuSaleAttrValueList">
          <template #="{ row, $index }">
            <!-- 属性值标签 -->
            <el-tag v-for="(item, index) in row.spuSaleAttrValueList" :key="row.id" closable style="margin: 0 5px;"
              @close="row.spuSaleAttrValueList.splice(index, 1)">
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input v-if="row.flag" placeholder="请输入属性值" size="small" style="width: 100px;" @blur="toLook(row)"
              v-model="row.saleAttrValue" :ref="(vc: any) => inputArr[$index] = vc" />
            <el-button v-else type="success" size="small" icon="Plus" @click="toEdit(row, $index)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template #="{ $index }">
            <el-button type="danger" size="small" icon="Delete" @click="saleAttr.splice($index, 1)" />
          </template>
        </el-table-column>
      </el-table>
      <el-form-item>
        <el-button type="primary" @click="save" :disabled="!saleAttr.length">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue';
import type { AllTradeMark, HasSaleAttr, HasSaleAttrResponseData, SaleAttr, SaleAttrResponseData, SaleAttrValue, SpuData, SpuHasImg, SpuImg, Trademark } from '../../../api/product/spu/type';
import { reqAddOrUpdateSpu, reqAllSaleAttr, reqAllTradeMark, reqSpuHasSaleAttr, reqSpuImageList } from '../../../api/product/spu';
import { ElMessage } from 'element-plus';
import useUserStore from '../../../store/modules/user';

let $emit = defineEmits(['changeScene'])
// 存储已有的SPU品牌数据
let allTradeMark = ref<Trademark[]>([])
// 存储商品图片
let imgList = ref<SpuImg[]>([])
// 存储已有的SPU销售属性
let saleAttr = ref<SaleAttr[]>([])
// 存储全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
// 存储已有的SPU对象
let spuParams = ref<SpuData>({
  spuName: '',
  description: '',
  category3Id: '',
  tmId: '',
  spuSaleAttrList: [],
  spuImageList: []
})
// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 存储要放大的图片
let dialogImageUrl = ref<string>('')
// 计算出当前SPU还未拥有的销售属性
let unSelectSaleArr = computed(() => {
  let unSelectArr = allSaleAttr.value.filter(item => {
    return saleAttr.value.every(item1 => {
      return item1.saleAttrName != item.name
    })
  })
  return unSelectArr
})

let saleAttrIdAndValueName = ref<string>('')
// 准备一个数组：将来存储对应的组件实例 el-input
let inputArr = ref<any>([])
// el-upload 上传文件需使用headers属性携带Token请求头
const userStore = useUserStore()
const headers = { Token: userStore.token }

// -----------------------------------------------------------------------------------------------------------------

// 点击取消按钮：通知父组件切换场景为0，展示已有的SPU数据
const cancel = () => {
  $emit('changeScene', {flag: 0, param: 'update'})
}
// 获取SPU数据方法
const initHasSpuData = async (spu: SpuData) => {
  // 存储已有的SPU对象，用于在模版中展示
  spuParams.value = spu
  // spu：即为父组件传递过来的已有的SPU对象[不完整]
  // 获取全部品牌数据
  const result1: AllTradeMark = await reqAllTradeMark()
  allTradeMark.value = result1.data
  // 获取某一品牌下全部售卖商品的图片
  const result2: SpuHasImg = await reqSpuImageList((spu.id as number))
  imgList.value = result2.data.map(item => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })
  // 获取已有的SPU销售属性的数据
  const result3: SaleAttrResponseData = await reqSpuHasSaleAttr((spu.id as number))
  saleAttr.value = result3.data
  // 获取整个项目全部SPU的销售属性
  const result4: HasSaleAttrResponseData = await reqAllSaleAttr()
  allSaleAttr.value = result4.data
}
// 新增SPU方法
const initAddSpu = async (c3Id: number) => {
  // 清空数据
  Object.assign(spuParams.value, {
    spuName: '',
    description: '',
    category3Id: '',
    tmId: '',
    spuSaleAttrList: [],
    spuImageList: []
  })
  imgList.value = []  
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''
  // 获取全部品牌数据
  const result1: AllTradeMark = await reqAllTradeMark()
  // 获取整个项目全部SPU的销售属性
  const result2: HasSaleAttrResponseData = await reqAllSaleAttr()
  allTradeMark.value = result1.data
  allSaleAttr.value = result2.data
  spuParams.value.category3Id = c3Id
}

// 照片预览
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
// 照片上传
const handleUpload = (file: any) => {
  if (file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg') {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传的图片大小不能超过3mb'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传失败！请上传 jpg/png/jpeg 格式的图片'
    })
    return false
  }
}
// 照片删除
const handleRemove = () => { }

// 添加销售属性的方法
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  const newSaleAttr: SaleAttr = {
    baseSaleAttrId: Number(baseSaleAttrId),
    saleAttrName,
    spuSaleAttrValueList: []
  }
  saleAttr.value.push(newSaleAttr)
  // 点击后清空下拉框选项
  saleAttrIdAndValueName.value = ''
}
// 添加属性值按钮的回调
const toEdit = (row: SaleAttr, $index: number) => {
  row.flag = true
  row.saleAttrValue = ''

  // 点击添加按钮自动聚焦
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
// 属性值输入框失去焦点的回调
const toLook = (row: SaleAttr) => {
  // 整理收集的属性的ID与属性值的名字
  const { baseSaleAttrId, saleAttrValue } = row

  // 非法情况判断
  // 1、判断属性值是否为空
  if (saleAttrValue?.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空！'
    })
    row.flag = false
    row.saleAttrValue = ''
    return
  }
  // 2、判断属性值是否在数组中存在
  let repeat = row.spuSaleAttrValueList.find(item => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值不能重复！'
    })
    return
  }

  // 整理成服务器需要的属性值形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: (saleAttrValue as string)
  }
  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  // 切换为查看模式
  row.flag = false
}
// 保存按钮的回调
const save = async () => {
  // 整理参数
  // 1. 照片墙数据
  spuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: item.response ? item.response.data : item.url,
    }
  })
  // 2. 销售属性的数据
  spuParams.value.spuSaleAttrList = saleAttr.value
  const result: any = await reqAddOrUpdateSpu(spuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: spuParams.value.id ? '更新SPU成功' : '新增SPU成功'
    })
    // 成功后返回
    $emit('changeScene', {flag: 0, param: spuParams.value.id ? 'update' : 'add'})
  } else {
    ElMessage({
      type: 'error',
      message: '操作失败！' + result.message
    })
  }
}

defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped></style>