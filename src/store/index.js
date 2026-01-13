import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null
  }),
  actions: {
    login(credentials) {
      // 模拟登录逻辑
      if (credentials.username === 'admin' && credentials.password === '123456') {
        this.isAuthenticated = true
        this.user = { username: 'admin', role: '管理员' }
        localStorage.setItem('isAuthenticated', 'true')
        return true
      }
      return false
    },
    logout() {
      this.isAuthenticated = false
      this.user = null
      localStorage.removeItem('isAuthenticated')
    },
    checkAuth() {
      this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    }
  }
})

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [
      { id: 1, username: 'john_doe', email: 'john@example.com', role: '用户', status: '正常', createTime: '2024-01-15' },
      { id: 2, username: 'jane_smith', email: 'jane@example.com', role: '管理员', status: '正常', createTime: '2024-01-10' },
      { id: 3, username: 'bob_wilson', email: 'bob@example.com', role: '用户', status: '禁用', createTime: '2024-01-08' },
      { id: 4, username: 'alice_brown', email: 'alice@example.com', role: '用户', status: '正常', createTime: '2024-01-05' },
      { id: 5, username: 'charlie_davis', email: 'charlie@example.com', role: '管理员', status: '正常', createTime: '2024-01-01' }
    ]
  }),
  actions: {
    addUser(user) {
      const newUser = {
        id: Date.now(),
        ...user,
        createTime: new Date().toISOString().split('T')[0]
      }
      this.users.push(newUser)
    },
    updateUser(id, userData) {
      const index = this.users.findIndex(user => user.id === id)
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...userData }
      }
    },
    deleteUser(id) {
      this.users = this.users.filter(user => user.id !== id)
    }
  }
})

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [
      { id: 'ORD001', customerName: '张三', productName: 'iPhone 15', quantity: 1, totalAmount: 5999, status: '待付款', createTime: '2024-01-20 10:30' },
      { id: 'ORD002', customerName: '李四', productName: 'MacBook Pro', quantity: 1, totalAmount: 12999, status: '已发货', createTime: '2024-01-19 14:20' },
      { id: 'ORD003', customerName: '王五', productName: 'iPad Air', quantity: 2, totalAmount: 7998, status: '已完成', createTime: '2024-01-18 09:15' },
      { id: 'ORD004', customerName: '赵六', productName: 'AirPods', quantity: 1, totalAmount: 1299, status: '待发货', createTime: '2024-01-17 16:45' },
      { id: 'ORD005', customerName: '孙七', productName: 'Apple Watch', quantity: 1, totalAmount: 2999, status: '已取消', createTime: '2024-01-16 11:30' }
    ]
  }),
  actions: {
    updateOrderStatus(id, status) {
      const order = this.orders.find(o => o.id === id)
      if (order) {
        order.status = status
      }
    }
  }
})

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [
      { id: 1, name: 'iPhone 15', category: '手机', price: 5999, stock: 50, status: '上架', createTime: '2024-01-01' },
      { id: 2, name: 'MacBook Pro', category: '电脑', price: 12999, stock: 20, status: '上架', createTime: '2024-01-02' },
      { id: 3, name: 'iPad Air', category: '平板', price: 3999, stock: 30, status: '上架', createTime: '2024-01-03' },
      { id: 4, name: 'AirPods', category: '配件', price: 1299, stock: 100, status: '上架', createTime: '2024-01-04' },
      { id: 5, name: 'Apple Watch', category: '智能穿戴', price: 2999, stock: 15, status: '下架', createTime: '2024-01-05' }
    ]
  }),
  actions: {
    addProduct(product) {
      const newProduct = {
        id: Date.now(),
        ...product,
        createTime: new Date().toISOString().split('T')[0]
      }
      this.products.push(newProduct)
    },
    updateProduct(id, productData) {
      const index = this.products.findIndex(product => product.id === id)
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...productData }
      }
    },
    deleteProduct(id) {
      this.products = this.products.filter(product => product.id !== id)
    },
    updateStock(id, stock) {
      const product = this.products.find(p => p.id === id)
      if (product) {
        product.stock = stock
      }
    }
  }
})