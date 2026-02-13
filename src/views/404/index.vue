<template>
  <div>
    <img src="../../assets/images/error_images/404.png">
    <el-button type="primary" size="large" @click="goHome">点击回到首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const $router = useRouter()
const goHome = () => $router.push('/home')
</script>

<style scoped lang="scss">
div {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 602px;
    height: 556px;
  }
}
</style>