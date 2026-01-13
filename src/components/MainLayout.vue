<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <el-aside width="200px" class="sidebar">
      <div class="sidebar-header">
        <h3>管理系统</h3>
      </div>

      <el-menu
        :default-active="$route.path"
        class="sidebar-menu"
        router
        unique-opened
        data-testid="sidebar-menu"
      >
        <el-menu-item index="/" data-testid="dashboard-menu">
          <el-icon><HomeFilled /></el-icon>
          <span>仪表板</span>
        </el-menu-item>

        <el-menu-item index="/users" data-testid="users-menu">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>

        <el-menu-item index="/orders" data-testid="orders-menu">
          <el-icon><DocumentChecked /></el-icon>
          <span>订单管理</span>
        </el-menu-item>

        <el-menu-item index="/products" data-testid="products-menu">
          <el-icon><Box /></el-icon>
          <span>产品管理</span>
        </el-menu-item>
      </el-menu>

      <div class="sidebar-footer">
        <el-button
          type="text"
          @click="handleLogout"
          data-testid="logout-button"
        >
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-button>
      </div>
    </el-aside>

    <!-- 主内容区域 -->
    <el-container class="main-content">
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-button
            type="text"
            @click="toggleSidebar"
            data-testid="toggle-sidebar"
          >
            <el-icon><Fold /></el-icon>
          </el-button>
        </div>

        <div class="header-right">
          <el-dropdown @command="handleCommand" data-testid="user-dropdown">
            <span class="el-dropdown-link">
              {{ authStore.user?.username || '用户' }}
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item command="settings">设置</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <el-main class="content">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
  HomeFilled,
  User,
  DocumentChecked,
  Box,
  SwitchButton,
  Fold,
  ArrowDown
} from '@element-plus/icons-vue'
import { useAuthStore } from '../store'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    authStore.logout()
    router.push('/login')
  } catch {
    // 用户取消操作
  }
}

const toggleSidebar = () => {
  // 简化版侧边栏切换，实际项目中可能需要更复杂的逻辑
  console.log('Toggle sidebar')
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人资料功能开发中')
      break
    case 'settings':
      ElMessage.info('设置功能开发中')
      break
    case 'logout':
      handleLogout()
      break
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
}

.sidebar {
  background-color: #f5f5f5;
  border-right: 1px solid #e6e6e6;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e6e6e6;
  background-color: white;
}

.sidebar-header h3 {
  margin: 0;
  color: #409eff;
  font-size: 18px;
  text-align: center;
}

.sidebar-menu {
  border-right: none;
  margin-top: 10px;
}

.sidebar-footer {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
}

.header {
  background-color: white;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  display: flex;
  align-items: center;
}

.el-dropdown-link:hover {
  color: #66b1ff;
}

.content {
  background-color: #f5f5f5;
  padding: 20px;
  overflow-y: auto;
}
</style>