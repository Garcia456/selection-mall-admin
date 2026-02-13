<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px; cursor: pointer;" @click="changeIcon">
    <component :is="layoutSettingStore.fold ? 'Expand': 'Fold'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="item in $route.matched" :to="item.path" v-show="item.meta.title">
      <el-icon style="vertical-align: -20%;">
        <component :is="item.meta.icon"></component>
      </el-icon> 
      <span style="margin-left: 5px;">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '../../../store/modules/setting';
import { useRoute } from 'vue-router';

const layoutSettingStore = useLayoutSettingStore()
const $route = useRoute()
const changeIcon = () => { layoutSettingStore.fold = !layoutSettingStore.fold }
// console.log($route);
</script>

<style scoped></style>