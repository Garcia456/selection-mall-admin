<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo">
    <p :class="{fold: layoutSettingStore.fold}">{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
import setting from '../../setting'
import useLayoutSettingStore from '../../store/modules/setting'

const layoutSettingStore = useLayoutSettingStore()
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  img {
    height: 30px;
    width: 30px;
  }

  p {
    font-size: $base-logo-title-fontSize;
    margin-left: 20px;

    &.fold {
      display: none;
    }
  }
}
</style>