<template>
  <el-card style="height: 70px;">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名：">
        <el-input placeholder="请输入用户名" style="width: 200px;" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" @click="addUser" v-has="`btn.User.add`">添加用户</el-button>
    <el-popconfirm :title="`确定删除这 ${selectIdArr.length} 个账号吗？`" width="200px" @confirm="deleteSelectUser">
      <template #reference>
        <el-button type="danger" :disabled="!selectIdArr.length">批量删除</el-button>
      </template>
    </el-popconfirm>
    <el-table border style="margin: 10px 0;" :data="userArr" @selection-change="selectChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column label="用户姓名" align="center" prop="username"></el-table-column>
      <el-table-column label="用户昵称" align="center" prop="name"></el-table-column>
      <el-table-column label="用户角色" align="center" prop="roleName"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="400px" align="center">
        <template #="{ row }">
          <el-button type="primary" size="small" icon="User" @click="setRole(row)" v-has="`btn.User.assgin`">分配角色</el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)" v-has="`btn.User.update`">编辑</el-button>
          <el-popconfirm :title="`确定删除“${row.username}”吗？`" width="200px" @confirm="deleteUser(row)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete" v-has="`btn.User.remove`">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]" background
      layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @size-change="getHasUser"
      @current-change="getHasUser" />
  </el-card>
  <!-- 抽屉 -->
  <el-drawer v-model="drawer" direction="rtl">
    <template #header>
      <h4>{{ userParams.id ? '编辑用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form ref="formRef" :model="userParams" :rules="rules">
        <el-form-item label="用户姓名" prop="username">
          <el-input placeholder="请输入用户姓名" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input placeholder="请输入用户昵称" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input placeholder="请输入用户密码" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名：">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox-group v-model="hasCheckedUserRole" @change="handleCheckedRoleChange">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
              style="display: block;">
              全选
            </el-checkbox>
            <el-checkbox v-for="item in allUserRole" :key="item.id" :label="item.id">
              {{ item.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import type { AllRole, AllRoleResponseData, Records, SetRoleData, User, UserResponseData } from '../../../api/acl/user/type';
import { reqAddUserOrUpdateUser, reqAllRole, reqRemoveUser, reqSelectUser, reqSetUserRole, reqUserInfo } from '../../../api/acl/user';
import { ElMessage } from 'element-plus';
import useLayoutSettingStore from '../../../store/modules/setting';

const pageNo = ref<number>(1)
const pageSize = ref<number>(5)
const total = ref<number>(0)
const userArr = ref<Records>([])
const drawer = ref<boolean>(false)
const drawer1 = ref<boolean>(false)
const formRef = ref()

// 复选框全选图标样式
const checkAll = ref<boolean>(false)
// 复选框未全选图标样式
const isIndeterminate = ref<boolean>(false)
const allUserRole = ref<AllRole>([])
const hasCheckedUserRole = ref<any[]>([])

// 收集添加/更新用户的信息
const userParams = reactive<User>({
  username: '',
  password: '',
  name: '',
})

// 自定义校验规则
const validatorUsername = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('用户姓名长度应大于等于2位'))
  }
}
const validatorName = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 4) {
    callback()
  } else {
    callback(new Error('用户昵称长度应大于等于4位'))
  }
}
const validatorPassword = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 6) {
    callback()
  } else {
    callback(new Error('用户昵称长度应大于等于6位'))
  }
}
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

// 要批量删除的角色列表
const selectIdArr = ref<any[]>([])
// 搜索关键字
const keyword = ref<string>('')
// 获取设置仓库
const settingStore = useLayoutSettingStore()

onMounted(() => {
  getHasUser()
})
// 获取已有的用户信息
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  const result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  } else {
    ElMessage({type: 'error', message: '请求错误'})
  }
}
// 添加用户按钮的回调
const addUser = () => {
  drawer.value = true
  Object.assign(userParams, {
    id: 0,
    username: '',
    password: '',
    name: '',
  })
  // 清空上一次的错误信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
// 修改用户按钮的回调
const updateUser = (row: User) => {
  // 清空上一次的错误信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
  drawer.value = true
  userParams.id = row.id
  userParams.name = row.name
  userParams.username = row.username
  userParams.password = row.password

}
// 添加或更新账户抽屉确定按钮的回调
const save = async () => {
  // 表单校验
  await formRef.value.validate()
  const result = await reqAddUserOrUpdateUser(userParams)
  if (result.code == 200) {
    drawer.value = true
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新用户成功' : '添加用户成功'
    })
    drawer.value = false
    getHasUser(userParams.id ? pageNo.value : 1)
    // 浏览器自动刷新一次
    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新用户失败' : '添加用户失败'
    })
  }
}

// 分配角色按钮的回调
const setRole = async (row: User) => {
  Object.assign(userParams, row)
  const result: AllRoleResponseData = await reqAllRole(userParams.id!)
  allUserRole.value = result.data.allRolesList
  hasCheckedUserRole.value = result.data.assignRoles.map(item => item.id)
  drawer1.value = true
}

const handleCheckAllChange = (val: boolean) => {
  hasCheckedUserRole.value = val ? allUserRole.value.map(item => item.id) : []
  isIndeterminate.value = false
}

const handleCheckedRoleChange = (val: string[]) => {
  const checkedCount = val.length
  const totalCount = allUserRole.value.length

  checkAll.value = checkedCount === totalCount
  isIndeterminate.value = checkedCount > 0 && checkedCount < totalCount
}

// 分配角色抽屉确定按钮的回调
const confirmClick = async () => {
  const data: SetRoleData = {
    roleIdList: hasCheckedUserRole.value,
    userId: userParams.id!
  }
  const result: any = await reqSetUserRole(data)
  console.log(result);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配角色成功'
    })
    drawer1.value = false
    getHasUser(pageNo.value)
  } else {
    ElMessage({
      type: 'error',
      message: '分配角色失败 ' + result.message
    })
  }
}

// 删除单个账号信息确认的回调
const deleteUser = async (row: User) => {
  const result = await reqRemoveUser(row.id!)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: `删除“${row.username}”成功` })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败 ' + result.message
    })
  }
}
// 表格所选项发生变化时的回调
const selectChange = (arr: any) => {
  selectIdArr.value = arr
}
// 批量删除按钮的回调
const deleteSelectUser = async () => {
  const idsList = selectIdArr.value.map(item => item.id)
  const result = await reqSelectUser(idsList)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: `删除成功` })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败 ' + result.message
    })
  }
}
// 搜索按钮的回调
const search = async () => {
  getHasUser()
  keyword.value = ''
}
// 重置按钮的回调
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
</style>