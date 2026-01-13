<template>
  <div class="user-management">
    <div class="page-header">
      <h1 data-testid="user-management-title">用户管理</h1>
      <el-button
        type="primary"
        @click="showAddDialog = true"
        data-testid="add-user-button"
      >
        <el-icon><Plus /></el-icon>
        新增用户
      </el-button>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card" data-testid="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="用户名">
          <el-input
            v-model="filterForm.username"
            placeholder="请输入用户名"
            clearable
            data-testid="username-filter"
          />
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input
            v-model="filterForm.email"
            placeholder="请输入邮箱"
            clearable
            data-testid="email-filter"
          />
        </el-form-item>

        <el-form-item label="角色">
          <el-select
            v-model="filterForm.role"
            placeholder="请选择角色"
            clearable
            data-testid="role-filter"
          >
            <el-option label="管理员" value="管理员" />
            <el-option label="用户" value="用户" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="filterForm.status"
            placeholder="请选择状态"
            clearable
            data-testid="status-filter"
          >
            <el-option label="正常" value="正常" />
            <el-option label="禁用" value="禁用" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="handleSearch"
            data-testid="search-button"
          >
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button
            @click="handleReset"
            data-testid="reset-button"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户列表 -->
    <el-card class="table-card" data-testid="user-table-card">
      <template #header>
        <div class="table-header">
          <span>用户列表</span>
          <span class="total-count">共 {{ filteredUsers.length }} 个用户</span>
        </div>
      </template>

      <el-table
        :data="paginatedUsers"
        style="width: 100%"
        data-testid="user-table"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column prop="role" label="角色" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === '正常' ? 'success' : 'danger'"
              data-testid="status-tag"
            >
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
              data-testid="edit-button"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
              data-testid="delete-button"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="filteredUsers.length"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        data-testid="pagination"
      />
    </el-card>

    <!-- 新增/编辑用户对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="500px"
      data-testid="user-dialog"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="userForm.username"
            placeholder="请输入用户名"
            data-testid="dialog-username-input"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="userForm.email"
            placeholder="请输入邮箱"
            data-testid="dialog-email-input"
          />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select
            v-model="userForm.role"
            placeholder="请选择角色"
            style="width: 100%"
            data-testid="dialog-role-select"
          >
            <el-option label="管理员" value="管理员" />
            <el-option label="用户" value="用户" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status" data-testid="dialog-status-radio">
            <el-radio label="正常">正常</el-radio>
            <el-radio label="禁用">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false" data-testid="cancel-button">取消</el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
            :loading="submitLoading"
            data-testid="submit-button"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { useUserStore } from '../store'

const userStore = useUserStore()

const showAddDialog = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const userFormRef = ref()

const filterForm = reactive({
  username: '',
  email: '',
  role: '',
  status: ''
})

const userForm = reactive({
  username: '',
  email: '',
  role: '用户',
  status: '正常'
})

const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

const filteredUsers = computed(() => {
  let users = userStore.users

  if (filterForm.username) {
    users = users.filter(user =>
      user.username.toLowerCase().includes(filterForm.username.toLowerCase())
    )
  }

  if (filterForm.email) {
    users = users.filter(user =>
      user.email.toLowerCase().includes(filterForm.email.toLowerCase())
    )
  }

  if (filterForm.role) {
    users = users.filter(user => user.role === filterForm.role)
  }

  if (filterForm.status) {
    users = users.filter(user => user.status === filterForm.status)
  }

  return users
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    filterForm[key] = ''
  })
  currentPage.value = 1
}

const handleEdit = (user) => {
  isEdit.value = true
  Object.assign(userForm, user)
  showAddDialog.value = true
}

const handleDelete = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.username}" 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    userStore.deleteUser(user.id)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消操作
  }
}

const handleSubmit = async () => {
  if (!userFormRef.value) return

  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true

      try {
        if (isEdit.value) {
          userStore.updateUser(userForm.id, userForm)
          ElMessage.success('更新成功')
        } else {
          userStore.addUser(userForm)
          ElMessage.success('添加成功')
        }

        showAddDialog.value = false
        resetForm()
      } finally {
        submitLoading.value = false
      }
    }
  })
}

const resetForm = () => {
  userFormRef.value?.resetFields()
  Object.assign(userForm, {
    username: '',
    email: '',
    role: '用户',
    status: '正常'
  })
  isEdit.value = false
}

watch(showAddDialog, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  color: #303133;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.table-card {
  margin-top: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.total-count {
  color: #909399;
  font-size: 14px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>