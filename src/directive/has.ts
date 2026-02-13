import useUserStore from "../store/modules/user";

export const isHasButton = (app: any) => {
  const userStore = useUserStore()
  // 全局自定义指令：实现按钮的权限
  app.directive('has', {
    // 代表使用这个全局自定义指令的DOM|组件挂载完毕的时候执行一次
    mounted(el: any, option: any) {
      if(!userStore.buttons.includes(option.value)) {
        el.parentNode.removeChild(el)
      }
    }
  })
}