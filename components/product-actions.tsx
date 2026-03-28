// components/product-actions.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { addToCart } from "@/actions/cart"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Product } from "@/types"

interface ProductActionsProps {
  product: Product
  whatsappMessage: string
}

export function ProductActions({ product, whatsappMessage }: ProductActionsProps) {
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
    <div className="mt-8 flex gap-4">
      <WhatsAppButton
        message={whatsappMessage}
        className="flex-1"
        disabled={!product.available}
      >
        Заказать через WhatsApp
      </WhatsAppButton>
      <Button
        variant="outline"
        disabled={!product.available}
        className="flex-1"
        onClick={handleAddToCart}
      >
        <Plus className="mr-2 h-5 w-5" /> Добавить в корзину
      </Button>
    </div>
  )
}