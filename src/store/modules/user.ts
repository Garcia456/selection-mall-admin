import { defineStore } from "pinia";
// 引入接口
import type { loginFormData, loginResponseData, userInfoResponseData } from '../../api/user/type';
import type { UserState } from "./types/type";
import { reqLogin, reqUserInfo, reqLogout } from "../../api/user";

// 引入本地存储的工具方法
import { GET_TOKEN, SET_TOKEN, REMOVE_TOKEN } from "../../utils/token";
// 引入路由（常量路由）
import { constantRoute, asyncRoute, anyRoute } from '../../router/routes'
import router from "../../router";
import { cloneDeep } from "lodash";

// 过滤异步路由
const filterAsyncRoute = (asyncRoute: any, routes: any) => {
  return asyncRoute.filter((item: any) => {
    if(routes.includes(item.name)) {
      if(item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

// 创建用户相关的小仓库
let useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(),  // 用户唯一标识token
      menuRoutes: [], // 仓库存储生成菜单需要数组
      username: '',
      avatar: '',
      buttons: []
    }
  },
  // 异步|逻辑的地方
  actions: {
    // 用户登录的方法
    async userLogin(data: loginFormData) {
      let result: loginResponseData = await reqLogin(data)
      // 登录请求：成功200->token
      // 登录请求：失败201->登录失败错误的信息
      if (result.code === 200) {
        // pinia仓库存储一下token
        // 由于pinia|vuex存储数据其实利用js对象
        // 刷新数据就消失
        this.token = (result.data as string)
        // 本地存储持久化一份
        SET_TOKEN((result.data as string))

        // 保证返回一个成功Promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },

    // 获取用户信息的方法
    async useInfo() {
      let result: userInfoResponseData = await reqUserInfo()
      if (result.code === 200) {
        this.username = result.data.name;
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons
      
        // 路由过滤及注册
        const userAsyncRoute:any = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes)
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        const allRoutes = [...userAsyncRoute, anyRoute]
        allRoutes.forEach(item => {
          router.addRoute(item)
        });
        console.log(result.data);
    
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },

    // 用户退出登录的方法
    async userLogout() {
      let result: any = await reqLogout()
      if (result.code === 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }

    }
  },
  getters: {

  }
})
// 对外暴露小仓库的方法
export default useUserStore;