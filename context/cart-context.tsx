"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Product } from "@/types/"
import { supabase } from "@/lib/supabase"

export interface CartItem extends Product {
  quantity: number
}

export interface OrderData {
  items: CartItem[]
  totalPrice: number
  timeSlot: string
  customerName?: string
  customerPhone?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
  totalPrice: number
  itemCount: number
  saveOrder: (orderData: OrderData) => Promise<{ id: number | null; error: string | null }>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
  setItems((prev) => prev.filter((item) => item.id !== productId))
}

  const clearCart = () => {
    setItems([])
  }

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const saveOrder = async (orderData: OrderData) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            items: orderData.items,
            total: orderData.totalPrice,
            time_slot: orderData.timeSlot,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Error saving order:', error)
        return { id: null, error: error.message }
      }

      // Clear cart after successful order
      clearCart()
      return { id: data?.id || null, error: null }
    } catch (err) {
      console.error('Failed to save order:', err)
      return { id: null, error: 'Failed to save order' }
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
        itemCount,
        saveOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
