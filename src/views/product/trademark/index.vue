<template>
  <div>
    <el-card>
      <!-- 卡片顶部添加品牌按钮 -->
      <el-button type="primary" icon="Plus" @click="addTrademark" v-has="`btn.Trademark.add`">添加品牌</el-button>
      <!-- 表格组件：用于展示已有的平台数据 -->
      <el-table border style="margin: 10px 0;" :data="trademarkArr">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="tmName" label="品牌名称" />
        <el-table-column label="品牌LOGO">
          <template #="{ row }">
            <img :src="row.logoUrl" style="width: 50px; height: 50px;"></img>
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row }">
            <el-button type="warning" icon="Edit" @click="updateTrademark(row)" v-has="`btn.Trademark.update`" />
            <el-popconfirm :title="`确定要删除品牌“${row.tmName}”吗？`" width="280" @confirm="removeTrademark(row.id)">
              <template #reference>
                <el-button type="danger" icon="Delete" v-has="`btn.Trademark.remove`" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器组件 pagination
        v-model: current-page:设置分页器当前页码
        v-model: page-size: 设置每一个展示数据条数
        page-sizes: 用于设置下拉菜单数据
        background: 设置分页器按钮的背景颜色
        layout: 设置分页器6个子组件布局调整 
      -->
      <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 10]" background
        layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getHasTrademark"
        @size-change="sizeChange" />
    </el-card>

    <!-- 对话框组件：在添加品牌与修改已有品牌的业务的时候使用结构 -->
    <el-dialog v-model="dialogFormVisible" :title='trademarkParams.id ? "修改品牌" : "添加品牌"' width="800">
      <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="trademarkParams.tmName" style="width: 240px" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">

          <!-- upload组件属性：action图片上传路径书写/api，代理服务器不发送这次post请求 -->
          <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="headers">
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-button type="primary" size="default" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import { reqHasTrademark, reqAddTrademarkOrUpdateTrademark, reqDeleteTrademark } from '../../../api/product/trademark';
import type { TrademarkResponseData, Records, Trademark } from '../../../api/product/trademark/type'
import { ElMessage, type UploadProps } from 'element-plus'
import useUserStore from '../../../store/modules/user'

// 当前页码
let pageNo = ref<number>(1)
// 每一页展示多少条数据
let limit = ref<number>(5)
// 存储已有品牌数据总数
let total = ref<number>(0)
// 存储已有品牌的数据
let trademarkArr = ref<Records>([])
// 控制对话框的显示
let dialogFormVisible = ref<boolean>(false)
// 定义收集新增品牌数据
let trademarkParams = reactive<Trademark>({
  logoUrl: '',
  tmName: ''
})
// 获取用户相关的小仓库：获取仓库内部token，登录成功以后携带给服务器
const userStore = useUserStore()
const headers = { token: userStore.token }

// 获取el-form组件实例
const formRef = ref()

// 获取已有品牌的接口封装为一个函数：在任何情况下获取数据，调用此函数即可
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TrademarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  // console.log(result);
  if (result.code == 200) {
    trademarkArr.value = result.data.records
    total.value = result.data.total
  }
}


// 组件挂载完毕--发一次请求，获取第一页、一页三个已有品牌数据
onMounted(() => {
  getHasTrademark()
})

// 当下拉菜单发生变化时触发此方法
const sizeChange = () => {
  // 没传参,页码归1
  getHasTrademark()
}

// 添加品牌按钮的回调
const addTrademark = () => {
  // 对话框显示
  dialogFormVisible.value = true
  // 清空收集的数据
  trademarkParams.logoUrl = ''
  trademarkParams.tmName = ''
  trademarkParams.id = 0

  formRef.value?.clearValidate()
}

// 修改已有品牌按钮的回调
// row 为插槽中的row，即为当前已有品牌
const updateTrademark = (row: Trademark) => {
  // 清空校验规则错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })

  dialogFormVisible.value = true
  Object.assign(trademarkParams, row)
}

// 对话框底部按钮的回调
const cancel = () => {
  // 对话框隐藏
  dialogFormVisible.value = false
}

const confirm = async () => {
  await formRef.value.validate()

  let result = await reqAddTrademarkOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功'
    })
    // 再次发请求获取已有全部的品牌数据
    getHasTrademark(pageNo.value)
  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败'
    })
  }
  // 对话框隐藏
  dialogFormVisible.value = false
}

// 上传图片组件-> 上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 钩子是在图片上传成功之前触发，上传文件之前可以约束文件类型与大小
  // 要求：上传文件格式为 png/jpeg/gif 大小 <4M
  if (rawFile.type == 'image/jpeg' || rawFile.type == 'image/png' || rawFile.type == 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小需小于4mb'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式需为 png/jpeg/gif'
    })
    return false
  }
}

// 上传成功后将图片url赋值
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, _uploadFile) => {
  // response：即为当前这次上传图片post请求服务器返回的数据
  trademarkParams.logoUrl = response.data
  // 图片上传成功，清除掉对应图片校验结果
  formRef.value.clearValidate()
}


// 品牌名称自定义校验规则的校验方法
const validatorTmName = (_rule: any, value: any, callBack: any) => {
  // 自定义规则
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error("品牌名称至少为2个字符"))
  }
}

const validatorLogoUrl = (_rule: any, value: any, callBack: any) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('请上传图片'))
  }

}

// 自定义规则
const rules = {
  // require：这个字段务必校验，表单项前面显示五角星
  // trigger：代表触发校验规则的时机[blur、change]
  tmName: [
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [
    { required: true, validator: validatorLogoUrl }
  ]
}

// 气泡确认框确定按钮的回调
const removeTrademark = async (id: number) => {
  const result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}

</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
