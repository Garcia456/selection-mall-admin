<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" :class="{ fold: layoutSettingStore.fold }">
      <Logo />
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu background-color="#001529" text-color="#fff" :collapse="layoutSettingStore.fold">
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: layoutSettingStore.fold }">
      <Tabbar />
    </div>
    <!-- 内容展示区域 -->
    <div class="layout_main" :class="{ fold: layoutSettingStore.fold }">
      <Main />
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import useUserStore from '../store/modules/user';
import Main from '../views/main/index.vue'
import Tabbar from '../views/tabbar/index.vue'
import useLayoutSettingStore from '../store/modules/setting';
import { onMounted } from 'vue';

const userStore = useUserStore()
const layoutSettingStore = useLayoutSettingStore()
// 目前首页挂载完毕发请求获取用户信息
onMounted(() => {
  userStore.useInfo();
})
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
    transition: all .3s;

    &.fold {
      width: $base-menu-min-width;
    }

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_tabbar {
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;

    position: fixed;
    left: $base-menu-width;
    top: 0;
    transition: all .3s;

    &.fold {
      left: $base-menu-min-width;
      width: calc(100% - $base-menu-min-width);
    }
  }

  .layout_main {
    width: calc(100% - $base-menu-width);
    height: calc(100% - $base-tabbar-height);

    position: absolute;
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;

    overflow: auto;
    transition: all .3s;

    &.fold {
      left: $base-menu-min-width;
      width: calc(100% - $base-menu-min-width);
    }
  }
}
</style>