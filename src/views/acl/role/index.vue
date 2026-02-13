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
    <el-button type="primary" icon="Plus" @click="addRole" v-has="`btn.Role.add`">添加角色</el-button>
    <el-table border style="margin: 10px 0;" :data="allRole">
      <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column label="角色名称" align="center" prop="roleName"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #="{ row }">
          <el-button type="primary" size="small" icon="User" @click="setPermission(row)" v-has="`btn.Role.assgin`">分配权限</el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)" v-has="`btn.Role.update`">编辑</el-button>
          <el-popconfirm :title="`确定要删除“${row.roleName}”吗？`" width="200px" @confirm="removeRole(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete" v-has="`btn.Role.remove`">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]" background
      layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @size-change="getHasRole"
      @current-change="getHasRole" />
  </el-card>
  <!-- 添加或编辑职位对话框组件 -->
  <el-dialog v-model="dialogVisible" :title="roleParams.id ? '编辑角色' : '添加角色'">
    <el-form style="margin: 10px 0;" :model="roleParams" :rules="rules" ref="form">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="dialogConfirm">确定</el-button>
    </template>
  </el-dialog>
  <!-- 分配权限抽屉组件 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree style="max-width: 600px" :data="menuArr" show-checkbox node-key="id" default-expand-all
        :props="defaultProps" :default-checked-keys="selectArr" ref="tree" />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handle">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import type { MenuList, MenuResponseData, RoleData, RoleResponseData } from '../../../api/acl/role/type';
import { reqAddOrUpdateRole, reqAllMenuList, reqAllRoleList, reqRemoveRole, reqSetPermission } from '../../../api/acl/role';
import useLayoutSettingStore from '../../../store/modules/setting';
import { ElMessage } from 'element-plus';

const keyword = ref<string>('')
const pageNo = ref<number>(1)
const pageSize = ref<number>(10)
const total = ref<number>(0)
const settingStore = useLayoutSettingStore()
// 接收职位分页数据
const allRole = ref()
// 控制对话框的显示
const dialogVisible = ref<boolean>(false)
// 存储要添加/编辑的职位数据
const roleParams = ref<RoleData>({
  roleName: '',
})
// 职位校验规则
const validatorRoleName = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名称长度需大于2位'))
  }
}
const rules = {
  roleName: [
    { required: true, trigger: 'blur', validator: validatorRoleName }
  ]
}
// 表单实例
const form = ref()
// 控制抽屉
const drawer = ref<boolean>()
// 存储分配角色权限列表
const menuArr = ref<MenuList>()
// tree要展示的数据项
const defaultProps = {
  children: 'children',
  label: 'name',
}
// 已勾选的权限列表
const selectArr = ref<number[]>([])
// 树形控件实例
const tree = ref()

onMounted(() => {
  getHasRole()
})
// 获取角色分页并展示
const getHasRole = async (pager = 1) => {
  pageNo.value = pager
  const result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}
// 搜索按钮的回调
const search = async () => {
  getHasRole()
  keyword.value = ''
}
// 重置按钮的回调
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}
// 添加角色按钮的回调
const addRole = () => {
  dialogVisible.value = true
  roleParams.value = { roleName: '' }
  nextTick(() => form.value.clearValidate())
}
// 编辑按钮的回调
const updateRole = (row: RoleData) => {
  dialogVisible.value = true
  nextTick(() => form.value.clearValidate())
  roleParams.value.id = row.id
  roleParams.value.roleName = row.roleName
}
// 对话框确定按钮的回调
const dialogConfirm = async () => {
  await form.value.validate()
  const result = await reqAddOrUpdateRole(roleParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: roleParams.value.id ? '编辑成功' : '添加成功'
    })
    dialogVisible.value = false
    getHasRole(roleParams.value.id ? pageNo.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: (roleParams.value.id ? '编辑失败' : '添加失败') + result.message
    })
  }
}
// 分配权限按钮的回调
const setPermission = async (row: RoleData) => {
  drawer.value = true
  roleParams.value = row
  const result: MenuResponseData = await reqAllMenuList(roleParams.value.id!)
  menuArr.value = result.data
  selectArr.value = filterSelectArr(menuArr.value, [])
}
// 过滤出要勾选的权限id
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.level == 4 && item.select) {
      initArr.push(item.id)
    } else if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  });
  return initArr
}
// 抽屉确定按钮的回调
const handle = async () => {
  const roleId = roleParams.value.id
  const arr1 = tree.value.getCheckedKeys()
  const arr2 = tree.value.getHalfCheckedKeys()
  const permissionId = arr1.concat(arr2)
  const result = await reqSetPermission(roleId!, permissionId)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '分配权限成功' })
    drawer.value = false
    window.location.reload()
  }
}
// 删除按钮的回调
const removeRole = async (id: number) => {
  const result: any = await reqRemoveRole(id)
  if(result.code == 200) {
    ElMessage({type: 'success', message: '删除成功'})
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
</style>