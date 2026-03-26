"use client"

import Image from "next/image"
import Link from "next/link"
import { Plus } from "lucide-react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { addToCart } from "@/actions/cart"
import { Product } from './../types/index';

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const imgRef = useRef<HTMLImageElement | null>(null)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })

    // 🔥 АНИМАЦИЯ
    const img = imgRef.current
    const cartIcon = document.getElementById("cart-icon")

    if (!img || !cartIcon) return

    const imgRect = img.getBoundingClientRect()
    const cartRect = cartIcon.getBoundingClientRect()

    const clone = img.cloneNode(true) as HTMLElement
    clone.style.position = "fixed"
    clone.style.left = `${imgRect.left}px`
    clone.style.top = `${imgRect.top}px`
    clone.style.width = `${imgRect.width}px`
    clone.style.height = `${imgRect.height}px`
    clone.style.transition = "all 0.7s ease-in-out"
    clone.style.zIndex = "9999"
    clone.style.pointerEvents = "none"

    document.body.appendChild(clone)

    requestAnimationFrame(() => {
      clone.style.left = `${cartRect.left}px`
      clone.style.top = `${cartRect.top}px`
      clone.style.width = "24px"
      clone.style.height = "24px"
      clone.style.opacity = "0.5"
    })

    setTimeout(() => clone.remove(), 700)
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          ref={imgRef}
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <CardContent className="p-4">
        <h3>{product.name}</h3>
        <p>{product.price} ₸</p>
      </CardContent>

      <CardFooter className="p-4 flex gap-2">
        <Button onClick={handleAddToCart}>
          <Plus className="h-4 w-4" />
        </Button>

        <Link href={`/product/${product.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Подробнее
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}