// store/useAppStore.ts
import { create } from "zustand"
import { Product, Slot } from "@/types"

// Для OrderStatus у тебя просто boolean
interface AppState {
  products: Product[] | null
  slots: Slot[] | null
  acceptOrders: boolean
  loading: boolean

  loadingSlotId: number | null           // для переключения доступности слота
  setLoadingSlotId: (id: number | null) => void
  orderToggleLoading: boolean            // для переключателя "Приём заказов"
  setOrderToggleLoading: (value: boolean) => void

  // Сеттеры
  setProducts: (products: Product[]) => void
  setSlots: (slots: Slot[]) => void
  setAcceptOrders: (value: boolean) => void
  setLoading: (loading: boolean) => void
  clearStore: () => void
}

export const useAppStore = create<AppState>((set) => ({
  products: null,
  slots: null,
  acceptOrders: false,
  loading: false,

  loadingSlotId: null,
  setLoadingSlotId: (id) => set({ loadingSlotId: id }),
  orderToggleLoading: false,
  setOrderToggleLoading: (value) => set({ orderToggleLoading: value }),

  // Сеттеры
  setProducts: (products) => set({ products }),
  setSlots: (slots) => set({ slots }),
  setAcceptOrders: (value) => set({ acceptOrders: value }),
  setLoading: (loading) => set({ loading }),
  clearStore: () =>
    set({
      products: null,
      slots: null,
      acceptOrders: false,
      loading: false,
      loadingSlotId: null,
      orderToggleLoading: false,
    }),
}))