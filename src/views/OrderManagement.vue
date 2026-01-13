<template>
  <div class="order-management">
    <div class="page-header">
      <h1 data-testid="order-management-title">订单管理</h1>
    </div>

    <!-- 筛选区域 -->
    <el-card class="filter-card" data-testid="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="订单号">
          <el-input
            v-model="filterForm.orderId"
            placeholder="请输入订单号"
            clearable
            data-testid="order-id-filter"
          />
        </el-form-item>

        <el-form-item label="客户姓名">
          <el-input
            v-model="filterForm.customerName"
            placeholder="请输入客户姓名"
            clearable
            data-testid="customer-name-filter"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="filterForm.status"
            placeholder="请选择状态"
            clearable
            data-testid="status-filter"
          >
            <el-option label="待付款" value="待付款" />
            <el-option label="待发货" value="待发货" />
            <el-option label="已发货" value="已发货" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已取消" value="已取消" />
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

    <!-- 订单列表 -->
    <el-card class="table-card" data-testid="order-table-card">
      <template #header>
        <div class="table-header">
          <span>订单列表</span>
          <span class="total-count">共 {{ filteredOrders.length }} 个订单</span>
        </div>
      </template>

      <el-table
        :data="paginatedOrders"
        style="width: 100%"
        data-testid="order-table"
      >
        <el-table-column prop="id" label="订单号" width="120" />
        <el-table-column prop="customerName" label="客户姓名" min-width="120" />
        <el-table-column prop="productName" label="产品名称" min-width="150" />
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="totalAmount" label="总金额" width="100">
          <template #default="scope">
            ¥{{ scope.row.totalAmount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag
              :type="getStatusType(scope.row.status)"
              data-testid="status-tag"
            >
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              @click="showOrderDetail(scope.row)"
              data-testid="view-detail-button"
            >
              查看详情
            </el-button>
            <el-dropdown
              v-if="canUpdateStatus(scope.row.status)"
              @command="(status) => handleUpdateStatus(scope.row, status)"
              data-testid="status-dropdown"
            >
              <el-button size="small" type="primary">
                更新状态
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="scope.row.status === '待付款'"
                    command="待发货"
                  >
                    标记为待发货
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.status === '待发货'"
                    command="已发货"
                  >
                    标记为已发货
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.status === '已发货'"
                    command="已完成"
                  >
                    标记为已完成
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="filteredOrders.length"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        data-testid="pagination"
      />
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      title="订单详情"
      width="600px"
      data-testid="order-detail-dialog"
    >
      <div v-if="currentOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">
            {{ currentOrder.id }}
          </el-descriptions-item>
          <el-descriptions-item label="客户姓名">
            {{ currentOrder.customerName }}
          </el-descriptions-item>
          <el-descriptions-item label="产品名称">
            {{ currentOrder.productName }}
          </el-descriptions-item>
          <el-descriptions-item label="数量">
            {{ currentOrder.quantity }}
          </el-descriptions-item>
          <el-descriptions-item label="总金额">
            ¥{{ currentOrder.totalAmount }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentOrder.status)">
              {{ currentOrder.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="下单时间" :span="2">
            {{ currentOrder.createTime }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDetailDialog = false" data-testid="close-detail-button">
            关闭
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, ArrowDown } from '@element-plus/icons-vue'
import { useOrderStore } from '../store'

const orderStore = useOrderStore()

const showDetailDialog = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const currentOrder = ref(null)

const filterForm = reactive({
  orderId: '',
  customerName: '',
  status: ''
})

const filteredOrders = computed(() => {
  let orders = orderStore.orders

  if (filterForm.orderId) {
    orders = orders.filter(order =>
      order.id.toLowerCase().includes(filterForm.orderId.toLowerCase())
    )
  }

  if (filterForm.customerName) {
    orders = orders.filter(order =>
      order.customerName.includes(filterForm.customerName)
    )
  }

  if (filterForm.status) {
    orders = orders.filter(order => order.status === filterForm.status)
  }

  return orders
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrders.value.slice(start, end)
})

const getStatusType = (status) => {
  const statusMap = {
    '待付款': 'warning',
    '待发货': 'info',
    '已发货': 'primary',
    '已完成': 'success',
    '已取消': 'danger'
  }
  return statusMap[status] || 'info'
}

const canUpdateStatus = (status) => {
  return ['待付款', '待发货', '已发货'].includes(status)
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    filterForm[key] = ''
  })
  currentPage.value = 1
}

const showOrderDetail = (order) => {
  currentOrder.value = order
  showDetailDialog.value = true
}

const handleUpdateStatus = (order, newStatus) => {
  orderStore.updateOrderStatus(order.id, newStatus)
  ElMessage.success(`订单 ${order.id} 状态已更新为 ${newStatus}`)
}
</script>

<style scoped>
.order-management {
  padding: 20px;
}

.page-header {
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

.order-detail {
  padding: 10px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>