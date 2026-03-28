"use client"

import { ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { getCart } from "@/actions/cart"

export function CartCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // начальное значение
    setCount(getCart().reduce((sum, i) => sum + i.quantity, 0))
    // слушаем обновления корзины
    const handler = (e: CustomEvent) => {
      setCount(e.detail.reduce((sum: any, i: any) => sum + i.quantity, 0))
    }

    window.addEventListener("cart-update", handler as EventListener)
    return () => window.removeEventListener("cart-update", handler as EventListener)
  }, [])

  return (
    <div className="relative" id="cart-icon">
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 rounded-full bg-red-500 px-2 text-xs text-white">
          {count}
        </span>
      )}
    </div>
  )
}