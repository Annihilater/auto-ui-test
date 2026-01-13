<template>
  <div class="dashboard">
    <div class="page-header">
      <h1 data-testid="dashboard-title">仪表板</h1>
      <p class="page-subtitle">欢迎使用管理系统</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card" data-testid="total-users-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon size="32" color="#409eff"><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ userStore.users.length }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card" data-testid="total-orders-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon size="32" color="#67c23a"><DocumentChecked /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ orderStore.orders.length }}</div>
            <div class="stat-label">总订单数</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card" data-testid="total-products-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon size="32" color="#e6a23c"><Box /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ productStore.products.length }}</div>
            <div class="stat-label">总产品数</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card" data-testid="pending-orders-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon size="32" color="#f56c6c"><Warning /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ pendingOrdersCount }}</div>
            <div class="stat-label">待处理订单</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>订单状态分布</span>
              </div>
            </template>
            <div class="chart-placeholder">
              <el-icon size="48" color="#909399"><PieChart /></el-icon>
              <p>图表功能开发中</p>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>用户增长趋势</span>
              </div>
            </template>
            <div class="chart-placeholder">
              <el-icon size="48" color="#909399"><TrendCharts /></el-icon>
              <p>图表功能开发中</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 最近活动 -->
    <el-card class="recent-activity" data-testid="recent-activity-card">
      <template #header>
        <div class="card-header">
          <span>最近活动</span>
        </div>
      </template>

      <el-timeline>
        <el-timeline-item
          v-for="activity in recentActivities"
          :key="activity.id"
          :timestamp="activity.time"
        >
          <div class="activity-content">
            <el-icon :color="activity.color">
              <component :is="activity.icon" />
            </el-icon>
            <span>{{ activity.description }}</span>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  User,
  DocumentChecked,
  Box,
  Warning,
  PieChart,
  TrendCharts,
  Plus,
  Edit,
  Delete
} from '@element-plus/icons-vue'
import { useUserStore, useOrderStore, useProductStore } from '../store'

const userStore = useUserStore()
const orderStore = useOrderStore()
const productStore = useProductStore()

const pendingOrdersCount = computed(() => {
  return orderStore.orders.filter(order =>
    order.status === '待付款' || order.status === '待发货'
  ).length
})

const recentActivities = [
  {
    id: 1,
    description: '新增用户：john_doe',
    time: '2024-01-20 10:30:00',
    icon: Plus,
    color: '#67c23a'
  },
  {
    id: 2,
    description: '订单 ORD001 状态更新为已发货',
    time: '2024-01-19 14:20:00',
    icon: Edit,
    color: '#e6a23c'
  },
  {
    id: 3,
    description: '删除产品：Apple Watch',
    time: '2024-01-18 09:15:00',
    icon: Delete,
    color: '#f56c6c'
  },
  {
    id: 4,
    description: '新增产品：iPhone 15',
    time: '2024-01-17 16:45:00',
    icon: Plus,
    color: '#67c23a'
  }
]
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 28px;
}

.page-subtitle {
  color: #909399;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.charts-section {
  margin-bottom: 30px;
}

.chart-card {
  height: 300px;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #909399;
}

.chart-placeholder p {
  margin: 10px 0 0 0;
}

.recent-activity {
  margin-top: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.activity-content span {
  color: #606266;
}
</style>