'use client'

import { Product } from "@/types"

export function ProductStats({ products }: { products: Product[] }) {
  const total = products.length
  const available = products.filter(p => p.available).length
  const unavailable = total - available

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="p-4 bg-card rounded-lg text-center">
        <div className="text-sm font-medium text-muted-foreground">Всего блюд</div>
        <div className="text-xl font-bold">{total}</div>
      </div>
      <div className="p-4 bg-card rounded-lg text-center">
        <div className="text-sm font-medium text-muted-foreground">В наличии</div>
        <div className="text-xl font-bold">{available}</div>
      </div>
      <div className="p-4 bg-card rounded-lg text-center">
        <div className="text-sm font-medium text-muted-foreground">Нет в наличии</div>
        <div className="text-xl font-bold">{unavailable}</div>
      </div>
    </div>
  )
}