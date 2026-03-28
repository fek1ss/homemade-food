"use client"

import { useEffect } from "react"
import { useAppStore } from "@/store/useAppStore"
import { ProductCard } from "./product-card"
import { Product, Slot } from "@/types"

type ProductGridProps = {
  initialProducts: Product[]
  initialSlots: Slot[]
  initialAcceptOrders: boolean
}

export function ProductGrid({
  initialProducts,
  initialSlots,
  initialAcceptOrders,
}: ProductGridProps) {
  const {
    products,
    slots,
    acceptOrders,
    setProducts,
    setSlots,
    setAcceptOrders,
  } = useAppStore()

  // ✅ Сохраняем данные в Zustand только если их еще нет
  useEffect(() => {
    if (!products) setProducts(initialProducts)
    if (!slots) setSlots(initialSlots)
    if (acceptOrders === null) setAcceptOrders(initialAcceptOrders)
  }, [])

  if (!products || !slots) return <p>Загрузка...</p>

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}