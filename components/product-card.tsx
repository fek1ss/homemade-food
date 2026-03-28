"use client"

import Image from "next/image"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { addToCart } from "@/actions/cart"
import { Product } from "./../types/index"
import { Info } from "lucide-react"

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
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
    <Card className="group overflow-hidden hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-foreground/40" />
        )}
      </div>

      <CardContent className="p-4">
        <h3>{product.name}</h3>
        <p>{product.price} ₸</p>
        {!product.available && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Сейчас это блюдо временно недоступно</span>
          </div>
        )}
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
