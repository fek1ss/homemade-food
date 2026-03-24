// Упрощенные типы для проекта без backend

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  available: boolean
}

export interface User {
  id: string
  email: string
  role: 'admin' | 'cashier'
  created_at: string
}

export interface Slot {
  id: number
  time: string
  maxOrders: number
  isActive: boolean
}

export interface Order {
  id: number
  customerName: string
  customerPhone: string
  customerEmail?: string
  deliveryAddress: string
  deliverySlotId: number
  items: any[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  created_at: string
}

// Упрощенные состояния (для совместимости с существующими компонентами)
export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export type UserRole = 'admin' | 'cashier'
