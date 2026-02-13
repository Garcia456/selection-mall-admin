import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置element-plus国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// @ts-ignore
import 'virtual:svg-icons-register'
// 引入自定义插件对象：注册整个项目全局组件
import globalComponent from './components/index'
// 引入模板的全局样式
import './styles/index.scss'
// 引入路由
import router from './router'
// 引入仓库
import pinia from './store'
// 引入路由鉴权
import './permission.ts';
// 引入暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'
import { isHasButton } from './directive/has.ts'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
// 安装自定义插件
app.use(globalComponent)
// 注册模板路由
app.use(router)
// 安装仓库
app.use(pinia)
// 执行自定义指令
isHasButton(app)

app.mount('#app')
