<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0;">
      <div v-show="scene == 0">
        <el-button type="primary" size="default" icon="Plus" :disabled="!categoryStore.c3Id"
          @click="addAttr" v-has="`btn.Attr.add`">添加属性</el-button>
        <el-table :border="true" style="margin: 10px 0;" :data="attrArr">
          <el-table-column label="序号" width="80" align="center" type="index" />
          <el-table-column label="属性名称" width="120px" prop="attrName" />
          <el-table-column label="属性值名称">
            <template #="{ row }">
              <el-tag style="margin: 5px;" type="primary" v-for="item in row.attrValueList">{{
                item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="row">
              <el-button type="warning" size="small" icon="Edit" @click="updateAttr(row.row)" v-has="`btn.Attr.update`" />
              <el-popconfirm title="确定要删除此属性吗？" width="200px" @confirm="deleteAttr(row.row.id)">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" v-has="`btn.Attr.remove`" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <el-form>
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" style="width: 240px;" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="default" icon="Plus" :disabled="!attrParams.attrName"
          @click="addAttrValue">添加属性值</el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table border style="margin: 20px 0;" :data="attrParams.attrValueList">
          <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
          <el-table-column label="属性值">
            <!-- row：即为当前属性值对象 -->
            <template #="{ row, $index }">
              <el-input :ref="(vc: any) => inputArr[$index] = vc" size="small" placeholder="请输入属性值名称"
                v-model="row.valueName" v-if="row.flag" @blur="toLook(row, $index)" />
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ $index }">
              <el-button type="danger" icon="Delete" size="small"
                @click="attrParams.attrValueList.splice($index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save" :disabled="!attrParams.attrValueList.length">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>

    </el-card>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue';
import { addOrUpdateAttr, reqAttr, reqRemoveAttr } from '../../../api/product/attr';
import type { AttrList, AttrResponseData, Attr, AttrValue } from '../../../api/product/attr/type';
import useCategoryStore from '../../../store/modules/category';
import { ElMessage } from 'element-plus';

const categoryStore = useCategoryStore()
const attrArr = ref<AttrList>([])
// 定义card组件内容切换变量
const scene = ref<number>(0)
// 收集新增的属性的数据
const attrParams = reactive<Attr>({
  attrName: '', // 新增的属性的名字
  attrValueList: [], // 新增的属性值数组
  categoryId: '', // 三级分类的id
  categoryLevel: 3, // 三级分类
})
// 准备一个数组：将来存储对应的组件实例 el-input
let inputArr = ref<any>([])

// 监听仓库三级分类ID变化
watch(() => categoryStore.c3Id, () => {
  // 清空上一次查询的属性与属性值
  attrArr.value = []
  // 保证三级分类得有才能发请求
  if (!categoryStore.c3Id) return
  // 获取分类的id
  getAttr()
})


// 获取已有属性与属性值的方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  // 获取已有的属性与属性值方法
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)

  if (result.code == 200) {
    attrArr.value = result.data
  }
}

// 添加属性按钮的回调
const addAttr = () => {
  // 每一次点击，先清空数据再收集数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: '',
    categoryLevel: 3,
  })
  // 切换界面
  scene.value = 1
  // 点击按钮获取新增属性的三级分类的ID
  attrParams.categoryId = categoryStore.c3Id
}

// 修改属性按钮的回调
const updateAttr = (row: Attr) => {
  // 切换为添加与修改属性的结构
  scene.value = 1
  // 将已有的属性对象赋值给 attrParams 对象
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))


}

// 取消按钮的回调
const cancel = () => {
  scene.value = 0
}

// 添加属性值按钮的回调
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true
  })

  // el-input 获取焦点
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })

}

// 保存按钮的回调
const save = async () => {
  let result: any = await addOrUpdateAttr(attrParams)
  if (result.code == 200) {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: '添加成功'
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '添加失败'
    })
  }
}

// 属性值表单元素失去焦点事件回调
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况1
  if (row.valueName.trim() == '') {
    // 删除调用对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    // 提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })

    return
  }

  // 非法情况2
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    // 删除重复的属性值
    attrParams.attrValueList.splice($index, 1)
    // 提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能重复'
    })
    return
  }
  // 展示div
  row.flag = false
}

// 属性值div点击事件
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  // nextTick(): 响应式数据发生变化，获取更新的DOM(组件实例)
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

// 删除属性按钮的回调
const deleteAttr = async (attrId: number) => {
  let result: any = await reqRemoveAttr(attrId)

  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除属性成功'
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除属性失败'
    })
  }
}

onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>