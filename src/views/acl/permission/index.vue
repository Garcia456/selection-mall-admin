<template>
  <el-card>
    <el-table :data="permissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="createTime"></el-table-column>
      <el-table-column label="操作">
        <template #="{ row }">
          <el-button type="primary" size="small" icon="Plus" :disabled="row.level == 4" @click="addPermission(row)" v-has="`btn.Permission.add`">{{
            row.level == 3 ? '添加功能' : '添加菜单' }}</el-button>
          <el-button type="primary" size="small" icon="Edit" :disabled="row.level == 1"
            @click="updatePermission(row)" v-has="`btn.Permission.update`">编辑</el-button>
          <el-popconfirm :title="`确定要删除“${row.name}”吗？`" width="250px" @confirm="removeMenu(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete" :disabled="row.level == 1" v-has="`btn.Permission.remove`">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 对话框组件：添加或编辑 -->
  <el-dialog width="500px" v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'">
    <el-form style="margin: 10px 0;">
      <el-form-item label="名称">
        <el-input placeholder="请输入菜单名称" v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-input placeholder="请输入权限数值" v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { reqAddOrUpdateMenu, reqAllPermission, reqRemoveMenu } from '../../../api/acl/menu';
import type { MenuParams, Permission, PermissionList, PermissionResponseData } from '../../../api/acl/menu/type';
import { ElMessage } from 'element-plus';

const dialogVisible = ref<boolean>(false)
const permissionArr = ref<PermissionList>([])
const menuData = reactive<MenuParams>({
  level: 0,
  name: '',
  code: '',
  pid: 0
})

onMounted(() => {
  getHasPermission()
})
// 获取菜单数据
const getHasPermission = async () => {
  const result: PermissionResponseData = await reqAllPermission()
  if (result.code == 200) permissionArr.value = result.data
}
// 添加菜单/功能按钮的回调
const addPermission = (row: Permission) => {
  dialogVisible.value = true
  Object.assign(menuData, {
    id: 0,
    level: 0,
    name: '',
    code: '',
    pid: 0
  })
  menuData.level = row.level + 1
  menuData.pid = row.id
}
// 编辑按钮的回调
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  Object.assign(menuData, {
    id: 0,
    level: 0,
    name: '',
    code: '',
    pid: 0
  })
  Object.assign(menuData, row)
}
// 对话框确定按钮的回调
const save = async () => {
  const result = await reqAddOrUpdateMenu(menuData)
  if (result.code == 200) {
    dialogVisible.value = false
    ElMessage({ type: 'success', message: menuData.id ? `更新成功` : `添加“${menuData.name}”成功` })

    getHasPermission()
  }
}
// 删除按钮的回调
const removeMenu = async (id: number) => {
  const result: any = await reqRemoveMenu(id)
  if(result.code == 200) {
    ElMessage({type: 'success', message: '删除成功'})
    getHasPermission()
  }
}
</script>

<style scoped></style>