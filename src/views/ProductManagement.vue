<template>
  <div class="product-management">
    <div class="page-header">
      <h1 data-testid="product-management-title">产品管理</h1>
      <el-button
        type="primary"
        @click="showAddDialog = true"
        data-testid="add-product-button"
      >
        <el-icon><Plus /></el-icon>
        新增产品
      </el-button>
    </div>

    <!-- 筛选区域 -->
    <el-card class="filter-card" data-testid="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="产品名称">
          <el-input
            v-model="filterForm.name"
            placeholder="请输入产品名称"
            clearable
            data-testid="product-name-filter"
          />
        </el-form-item>

        <el-form-item label="分类">
          <el-select
            v-model="filterForm.category"
            placeholder="请选择分类"
            clearable
            data-testid="category-filter"
          >
            <el-option label="手机" value="手机" />
            <el-option label="电脑" value="电脑" />
            <el-option label="平板" value="平板" />
            <el-option label="配件" value="配件" />
            <el-option label="智能穿戴" value="智能穿戴" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="filterForm.status"
            placeholder="请选择状态"
            clearable
            data-testid="status-filter"
          >
            <el-option label="上架" value="上架" />
            <el-option label="下架" value="下架" />
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

    <!-- 产品列表 -->
    <el-card class="table-card" data-testid="product-table-card">
      <template #header>
        <div class="table-header">
          <span>产品列表</span>
          <span class="total-count">共 {{ filteredProducts.length }} 个产品</span>
        </div>
      </template>

      <el-table
        :data="paginatedProducts"
        style="width: 100%"
        data-testid="product-table"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="产品名称" min-width="150" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === '上架' ? 'success' : 'info'"
              data-testid="status-tag"
            >
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
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
              type="warning"
              @click="handleUpdateStock(scope.row)"
              data-testid="stock-button"
            >
              库存管理
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
        :total="filteredProducts.length"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        data-testid="pagination"
      />
    </el-card>

    <!-- 新增/编辑产品对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="isEdit ? '编辑产品' : '新增产品'"
      width="500px"
      data-testid="product-dialog"
    >
      <el-form
        ref="productFormRef"
        :model="productForm"
        :rules="productRules"
        label-width="80px"
      >
        <el-form-item label="产品名称" prop="name">
          <el-input
            v-model="productForm.name"
            placeholder="请输入产品名称"
            data-testid="dialog-name-input"
          />
        </el-form-item>

        <el-form-item label="分类" prop="category">
          <el-select
            v-model="productForm.category"
            placeholder="请选择分类"
            style="width: 100%"
            data-testid="dialog-category-select"
          >
            <el-option label="手机" value="手机" />
            <el-option label="电脑" value="电脑" />
            <el-option label="平板" value="平板" />
            <el-option label="配件" value="配件" />
            <el-option label="智能穿戴" value="智能穿戴" />
          </el-select>
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input-number
            v-model="productForm.price"
            :min="0"
            :precision="2"
            controls-position="right"
            style="width: 100%"
            data-testid="dialog-price-input"
          />
        </el-form-item>

        <el-form-item label="库存" prop="stock">
          <el-input-number
            v-model="productForm.stock"
            :min="0"
            controls-position="right"
            style="width: 100%"
            data-testid="dialog-stock-input"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="productForm.status" data-testid="dialog-status-radio">
            <el-radio label="上架">上架</el-radio>
            <el-radio label="下架">下架</el-radio>
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

    <!-- 库存管理对话框 -->
    <el-dialog
      v-model="showStockDialog"
      title="库存管理"
      width="400px"
      data-testid="stock-dialog"
    >
      <div v-if="currentProduct" class="stock-info">
        <p><strong>产品：</strong>{{ currentProduct.name }}</p>
        <p><strong>当前库存：</strong>{{ currentProduct.stock }}</p>
      </div>

      <el-form :model="stockForm" label-width="80px" class="stock-form">
        <el-form-item label="新库存">
          <el-input-number
            v-model="stockForm.newStock"
            :min="0"
            controls-position="right"
            style="width: 100%"
            data-testid="new-stock-input"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showStockDialog = false" data-testid="cancel-stock-button">取消</el-button>
          <el-button
            type="primary"
            @click="handleUpdateStockConfirm"
            data-testid="confirm-stock-button"
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
import { useProductStore } from '../store'

const productStore = useProductStore()

const showAddDialog = ref(false)
const showStockDialog = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const productFormRef = ref()
const currentProduct = ref(null)

const filterForm = reactive({
  name: '',
  category: '',
  status: ''
})

const productForm = reactive({
  name: '',
  category: '',
  price: 0,
  stock: 0,
  status: '上架'
})

const stockForm = reactive({
  newStock: 0
})

const productRules = {
  name: [
    { required: true, message: '请输入产品名称', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于等于0', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存必须大于等于0', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

const filteredProducts = computed(() => {
  let products = productStore.products

  if (filterForm.name) {
    products = products.filter(product =>
      product.name.toLowerCase().includes(filterForm.name.toLowerCase())
    )
  }

  if (filterForm.category) {
    products = products.filter(product => product.category === filterForm.category)
  }

  if (filterForm.status) {
    products = products.filter(product => product.status === filterForm.status)
  }

  return products
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
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

const handleEdit = (product) => {
  isEdit.value = true
  Object.assign(productForm, product)
  showAddDialog.value = true
}

const handleUpdateStock = (product) => {
  currentProduct.value = product
  stockForm.newStock = product.stock
  showStockDialog.value = true
}

const handleDelete = async (product) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除产品 "${product.name}" 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    productStore.deleteProduct(product.id)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消操作
  }
}

const handleSubmit = async () => {
  if (!productFormRef.value) return

  await productFormRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true

      try {
        if (isEdit.value) {
          productStore.updateProduct(productForm.id, productForm)
          ElMessage.success('更新成功')
        } else {
          productStore.addProduct(productForm)
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

const handleUpdateStockConfirm = () => {
  if (currentProduct.value) {
    productStore.updateStock(currentProduct.value.id, stockForm.newStock)
    ElMessage.success('库存更新成功')
    showStockDialog.value = false
  }
}

const resetForm = () => {
  productFormRef.value?.resetFields()
  Object.assign(productForm, {
    name: '',
    category: '',
    price: 0,
    stock: 0,
    status: '上架'
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
.product-management {
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

.stock-info {
  margin-bottom: 20px;
}

.stock-info p {
  margin: 5px 0;
  color: #606266;
}

.stock-form {
  margin-top: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>