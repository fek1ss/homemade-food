"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { addToCart, getCart } from "@/actions/cart"
import { Product } from "@/types"
import { useEffect, useState } from "react"

interface Props {
  product: Product
  className?: string
}

export function AddToCartButton({ product, className }: Props) {
  const [isInCart, setIsInCart] = useState(false)

  useEffect(() => {
    const cart = getCart()
    const exists = cart.some((item) => item.id === product.id)
    setIsInCart(exists)
  }, [product.id])

  const handleAddToCart = () => {
    if (!product.available || isInCart) return

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })

    setIsInCart(true) // 🔥 сразу обновляем UI
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={!product.available || isInCart}
      className={className}
    >
      <Plus className="h-4 w-4 mr-1" />
      {isInCart ? "В корзине" : "В корзину"}
    </Button>
  )
}