"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/lib/supabase"

export interface Slot {
  id: string | number
  time: string
  currentOrders: number
  maxOrders: number
  isActive: boolean
}

export interface OrderSettings {
  isOpen: boolean
}

interface OrderContextType {
  orderSettings: OrderSettings
  setOrderOpen: (isOpen: boolean) => void
  
  slots: Slot[]
  selectedSlot: Slot | null
  selectSlot: (slot: Slot | null) => void
  updateSlot: (slotId: string | number, updates: Partial<Slot>) => void
  
  getAvailableSlots: () => Slot[]
  isSlotAvailable: (slot: Slot) => boolean
  loading: boolean
  error: string | null
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

// Initial mock data (fallback)
const initialSlots: Slot[] = [
  { id: "1", time: "12:00", currentOrders: 0, maxOrders: 10, isActive: true },
  { id: "2", time: "16:00", currentOrders: 0, maxOrders: 10, isActive: true },
  { id: "3", time: "20:00", currentOrders: 0, maxOrders: 10, isActive: true },
]

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orderSettings, setOrderSettings] = useState<OrderSettings>({ isOpen: true })
  const [slots, setSlots] = useState<Slot[]>(initialSlots)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch time slots from Supabase on mount
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true)

        const { data: slotsData, error: slotsError } = await supabase
          .from('time_slots')
          .select('*')
          .order('time')

        if (slotsError) {
          console.error('Error fetching time slots:', slotsError)
          setError(slotsError.message)
          return
        }

        if (slotsData && slotsData.length > 0) {
          const mappedSlots = slotsData.map((item: any) => ({
            id: item.id,
            time: item.time,
            currentOrders: item.current_orders ?? 0,
            maxOrders: item.max_orders ?? item.capacity ?? 10,
            isActive: item.is_active ?? item.available ?? true,
          }))
          setSlots(mappedSlots)
        }
      } catch (err) {
        console.error('Failed to fetch order data:', err)
        setError('Failed to fetch order data')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderData()
  }, [])

  const setOrderOpen = async (isOpen: boolean) => {
    try {
      // Note: You can manage open/closed status via time_slots.available field
      // Or create a separate order_settings table if needed
      // For now, we just update local state
      setOrderSettings({ isOpen })
    } catch (err) {
      console.error('Failed to update order settings:', err)
    }
  }

  const selectSlot = (slot: Slot | null) => {
    setSelectedSlot(slot)
  }

  const updateSlot = async (slotId: string | number, updates: Partial<Slot>) => {
    try {
      const updateData: any = {}
      if (updates.maxOrders !== undefined) updateData.max_orders = updates.maxOrders
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive

      const { error } = await supabase
        .from('time_slots')
        .update(updateData)
        .eq('id', slotId)

      if (error) {
        console.error('Error updating slot:', error)
        return
      }

      setSlots((prev) =>
        prev.map((slot) =>
          slot.id === slotId ? { ...slot, ...updates } : slot
        )
      )
    } catch (err) {
      console.error('Failed to update slot:', err)
    }
  }

  const isSlotAvailable = (slot: Slot): boolean => {
    return slot.isActive
  }

  const getAvailableSlots = (): Slot[] => {
    return slots.filter((slot) => slot.isActive)
  }

  return (
    <OrderContext.Provider
      value={{
        orderSettings,
        setOrderOpen,
        slots,
        selectedSlot,
        selectSlot,
        updateSlot,
        getAvailableSlots,
        isSlotAvailable,
        loading,
        error,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider")
  }
  return context
}
