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
  time_range: string
  available: boolean
}


export type UserRole = 'admin' | 'cashier'
