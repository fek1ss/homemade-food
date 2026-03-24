"use client"

import Image from "next/image"
import Link from "next/link"
import { Plus, Check } from "lucide-react"
import { Product } from "@/types"
import { useCart } from "@/context/cart-context"
import { useOrder } from "@/context/order-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useState, useRef } from "react"
import { useFlyToCart } from "@/hooks/use-fly-to-cart"

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart()
  const { orderSettings } = useOrder()
  const [isAdding, setIsAdding] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { flyToCart } = useFlyToCart()

  const canAddToCart = product.isAvailable && orderSettings.isOpen

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (canAddToCart && !isAdding) {
      setIsAdding(true)
      
      // Trigger fly animation
      if (cardRef.current) {
        flyToCart(cardRef.current, product.image)
      }
      
      addToCart(product)
      setTimeout(() => setIsAdding(false), 800)
    }
  }

  return (
    <Card ref={cardRef} className="group overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute bottom-2 left-2">
            {product.isAvailable ? (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                В наличии
              </span>
            ) : (
              <span className="rounded-full bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground">
                Нет в наличии
              </span>
            )}
          </div>
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-foreground/40" />
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-1 text-lg font-semibold text-foreground transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xl font-bold text-primary">{product.price} ₽</p>
      </CardContent>

      <CardFooter className="flex gap-2 p-4 pt-0">
        <Link href={`/product/${product.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Подробнее
          </Button>
        </Link>
        <Button
          size="icon"
          disabled={!canAddToCart || isAdding}
          onClick={handleAddToCart}
          className={`shrink-0 transition-all duration-300 ${
            isAdding ? "scale-110 bg-accent text-accent-foreground" : ""
          }`}
        >
          {isAdding ? (
            <Check className="h-5 w-5 animate-in zoom-in-50" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
