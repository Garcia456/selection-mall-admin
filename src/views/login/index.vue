<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" :prefix-icon="Lock" show-password v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="login_btn" type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';
// 引入用户相关的小仓库
import useUserStore from '../../store/modules/user';
let userStore = useUserStore()
// 引入路由器、路由
import { useRouter, useRoute } from 'vue-router';
// 引入登录信息提示框
import { ElNotification } from 'element-plus';
// 引入获取当前时间的函数
import { getTime } from '../../utils/time';

// 获取路由器
const $router = useRouter()
// 获取路由
const $route = useRoute()
// 定义变量控制登录按钮的加载效果
let loading = ref(false)
// 收集账号与密码的数据
const loginForm = reactive({ username: 'admin', password: '111111' })
const loginForms = ref()
// 登录按钮回调
const login = async () => {
  // 保证全部表单校验通过再发请求
  await loginForms.value.validate()

  loading.value = true
  // 点击登录按钮后干什么？
  // 通知仓库发登录请求
  // 请求成功->转到首页展示数据的地方
  // 请求失败->弹出登录失败信息
  try {
    // 保证登录成功
    await userStore.userLogin(loginForm)
    // 登录成功编程式路由导航跳转页面
    $router.push(($route.query.redirect) as any || '/')
    ElNotification({
      type: 'success',
      message: '登录成功',
      title: `Hi！${getTime()}好`
    })
    // 登录成功加载效果消失
    loading.value = false
  } catch (error: any) {
    // 登录失败加载效果消失
    loading.value = false
    ElNotification({
      type: 'error',
      message: error
    })
  }
}

// 自定义校验规则函数
const validatorUserName = (_rule: any, value: any, callback: any) => {
  if (value.length >= 4) {
    return callback()
  } else {
    return callback(new Error('账号长度应在4到10位'))
  }
}
const validatorPassword = (_rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    return callback()
  } else {
    return callback(new Error('密码长度应在6到15位'))
  }
}

// 定义表单校验需要配置的对象
const rules = {
  username: [
    // { require: true, min: 4, max: 10, message: '账号长度在5到10位', trigger: 'change' }
    { validator: validatorUserName, trigger: 'change' }
  ],
  password: [
    // { require: true, min: 6, max: 15, message: '密码长度在6到15位', trigger: 'change' }
    { validator: validatorPassword, trigger: 'change' }
  ]
}

</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background-image: url('@/assets/images/background.jpg');
  background-repeat: no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
  }

  h1 {
    font-size: 40px;
    color: white;
  }

  h2 {
    font-size: 20px;
    color: white;
    margin: 20px 0;
  }

  .login_btn {
    width: 100%;
  }
}
</style>