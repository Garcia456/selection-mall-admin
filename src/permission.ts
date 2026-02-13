// 路由鉴权：项目当中路由能不能被访问的权限的设置（某一个路由在什么条件下可以被访问，什么条件下不能被访问）
import router from "./router";
import nprogress from 'nprogress';
// 引入进度条样式
import 'nprogress/nprogress.css';
// 引入仓库
import useUserStore from "./store/modules/user";
import setting from "./setting";
// 取消进度条圆圈效果
nprogress.configure({showSpinner: false});

// 全局守卫：项目当中任意路由切换都会出发的钩子

// 全局前置守卫
router.beforeEach( async (to:any, _from:any, next:any) => {
    // to:你将要访问哪个路由
    // from:你从哪个路由而来
    // next:路由的放行函数
    nprogress.start()

    const userStore = useUserStore()
    // 获取token，判断用户是否登录
    const token = userStore.token
    // 获取username，判断是否有用户信息
    const username = userStore.username
    // 更改页面标题
    document.title = `${setting.title}-${to.meta.title}`

    // 用户登录判断
    // 登录
    if(token) {
        // 成功，不能访问login
        if(to.path === '/login') {
            next({path: '/'})
        } else {
            // 有用户信息，放行
            if(username) {
                next()
            // 没有用户信息，获取用户信息
            } else {
                try {
                    await userStore.useInfo()
                    // 获取用户信息成功，放行
                    // 可能在加载异步路由未完成时就放行导致到了空白页
                    next({...to})
                } catch(error) {
                    // 获取用户信息失败（token过期/用户手动修改token），退出登录->用户相关数据清空
                    await userStore.userLogout()
                    next({path: '/login', query: {redirect: to.path}})
                }
            }
        }
    // 未登录
    } else {
        if(to.path === '/login') {
            next()
        } else {
            next({path: '/login', query: {redirect: to.path}})
        }
        
    }
})

// 全局后置守卫
router.afterEach((_to:any, _from:any) => {
    nprogress.done()
})