// layout组件配置相关仓库
import { defineStore } from "pinia";
const useLayoutSettingStore = defineStore('settingStore', {
  state: () => {
    return {
      fold: false,  // 用户控制菜单折叠还是展开
      refresh: false,
    }
  }
})
export default useLayoutSettingStore