export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  isAvailable: boolean
}

export interface Slot {
  id: string | number
  time: string
  currentOrders: number
  maxOrders: number
  isActive: boolean
}

export type UserRole = 'admin' | 'cashier'

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}
