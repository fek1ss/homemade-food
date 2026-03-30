"use client"

import { useState } from "react"
import { Slot } from "@/types"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { addToCart } from "@/actions/cart"
import { Plus } from "lucide-react"

export function ProductClient({
  product,
  slots,
  acceptOrders,
}: {
  product: any
  slots: Slot[]
  acceptOrders: boolean
}) {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  const handleAddToCart = () => {
    if (!product.available) return

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
        {product.name}
      </h1>

      <p className="mt-4 text-3xl font-bold text-primary">
        {product.price} ₸
      </p>

      <p className="mt-4 text-muted-foreground">
        {product.description}
      </p>

      {/* Слоты */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Доступные слоты</h2>
        <p className="mx-auto mb-6 text-pretty text-lg text-muted-foreground">выберите время доставки</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {slots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => setSelectedSlot(slot)}
              disabled={!slot.available}
              className={`px-3 py-1 rounded-md text-sm transition ${
                slot.available
                  ? selectedSlot?.id === slot.id
                    ? "bg-primary text-white"
                    : "bg-muted/50 hover:bg-muted"
                  : "bg-muted text-muted-foreground line-through"
              }`}
            >
              {slot.time_range}
            </button>
          ))}
        </div>
      </div>

      {/* Кнопки */}
      <div className="mt-6 flex gap-3">
        <WhatsAppButton
          product={product}
          selectedSlot={selectedSlot}
          disabled={!acceptOrders || !selectedSlot || !product.available}
          className="flex-1"
        />

        <button
          onClick={handleAddToCart}
          disabled={!product.available}
          className="flex items-center justify-center gap-2 px-4 rounded-lg border border-border hover:bg-muted transition disabled:opacity-50"
        >
          <Plus className="h-5 w-5" />
          В корзину
        </button>
      </div>

      {!acceptOrders && (
        <p className="mt-2 text-sm text-destructive">
          Приём заказов закрыт
        </p>
      )}
    </div>
  )
}