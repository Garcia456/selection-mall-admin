<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select style="width: 240px" v-model="categoryStore.c1Id" @change="handler1" :disabled="scene == 0 ? false: true">
          <!-- label:即为展示数据    value:即为select下拉菜单收集的数据 -->
          <el-option v-for="c1 in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select style="width: 240px" v-model="categoryStore.c2Id" @change="handler2" :disabled="scene == 0 ? false: true">
          <el-option v-for="c2 in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select style="width: 240px" v-model="categoryStore.c3Id" :disabled="scene == 0 ? false: true">
          <el-option v-for="c3 in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
// 引入组件挂载完毕方法
import { onMounted } from 'vue';

// 引入分类相关的仓库
import useCategoryStore from '../../store/modules/category';
const categoryStore = useCategoryStore()

// 接受父组件传递过来的scene
defineProps(['scene'])

// 分类组全局组件挂载完毕，通知仓库发请求获取一级分类的数据
onMounted(() => {
  getC1()
})

// 通知仓库获取一级分类的方法
const getC1 = () => {
  // 通知分类仓库发请求获取一级分类的数据
  categoryStore.getC1();
}

const handler1 = () => {
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  categoryStore.getC2();
}
const handler2 = () => {
  categoryStore.c3Id = ''
  categoryStore.getC3();
}

</script>
<style scoped></style>