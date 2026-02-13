<template>
  <el-button icon="Refresh" circle @click="updateRefresh" />
  <el-button icon="FullScreen" circle @click="fullScreen" />
  <!-- 弹出框组件 -->
  <el-popover placement="bottom" title="主题设置" :width="200" trigger="click">
    <template #reference>
      <el-button icon="Setting" circle />
    </template>
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          v-model="color"
          show-alpha
          :predefine="predefineColors"
          size="small"
          :teleported="false"
          @change="setColor"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch v-model="dark" inline-prompt active-icon="Moon" inactive-icon="Sunny" @change="changeDark" />
      </el-form-item>
    </el-form>
  </el-popover>
  <img :src="userStore.avatar" style="width: 32px; height: 32px; margin: 0 12px; border-radius: 50%;">
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '../../../store/modules/setting';
import useUserStore from '../../../store/modules/user';
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router';

const layoutSettingStore = useLayoutSettingStore()
const userStore = useUserStore()
const $router = useRouter()
const $route = useRoute()
const dark = ref<boolean>(false)
// color-picker 所需数据
const color = ref('')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

// 刷新按钮
const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}

// 全屏按钮点击的回调
const fullScreen = () => {
  // DOM对象的一个属性：可以用来判断当前是不是全屏模式[全屏：true，不是全屏：false]
  let full = document.fullscreenElement
  // 切换为全屏模式
  if (!full) {
    // 文档根节点的方法requestFullscreen,实现全屏模式
    document.documentElement.requestFullscreen();
  } else {
    // 变为不是全屏模式 -> 退出全屏模式
    document.exitFullscreen();
  }
}

// 退出登录点击的回调
const logout = async () => {
  // 第一件事情：需要向服务器发请求[退出登录接口]
  // 第二件事情：仓库当中关于用户相关的数据清空[token|username|avatar]
  // 第三件事情：跳转到登录页面
  await userStore.userLogout();
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
// 暗黑模式开关的回调
const changeDark = () => {
  const html = document.documentElement
  dark.value ? html.className = 'dark' : html.className = ''
}
// 主题颜色的切换
const setColor = () => {
  console.log(123);
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
  html.style.setProperty('--el-color-success', color.value)
  html.style.setProperty('--el-color-warning', color.value)
  html.style.setProperty('--el-color-danger', color.value)
  html.style.setProperty('--el-color-info', color.value)
}
</script>

<style scoped></style>