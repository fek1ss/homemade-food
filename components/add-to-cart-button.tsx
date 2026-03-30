"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { addToCart } from "@/actions/cart"
import { Product } from "@/types"

interface Props {
  product: Product
  className?: string
}

export function AddToCartButton({ product, className }: Props) {
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
    <Button
      onClick={handleAddToCart}
      disabled={!product.available}
      className={className}
    >
      <Plus className="h-4 w-4 mr-1" />
      В корзину
    </Button>
  )
}