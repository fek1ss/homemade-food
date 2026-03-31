"use client"

import { Product } from "@/types" // тип продукта из вашей БД
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Check, X, Trash2 } from "lucide-react"
import { useActionState } from "react"
import { toggleProductAvailability, deleteProduct } from "@/actions/products"
import { useState } from "react"

interface AdminProductCardProps {
  product: Product
}

export function AdminProductCard({ product }: AdminProductCardProps) {
  const [stateToggle, toggleAction] = useActionState(
    toggleProductAvailability,
    { error: "" },
  )
  const [stateDelete, deleteAction] = useActionState(deleteProduct, {
    error: "",
  })

  return (
    <Card className="overflow-hidden">
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
        <h3 className="line-clamp-1 text-lg font-semibold text-foreground">
          {product.name}
        </h3>
        <p className="mt-1 text-xl font-bold text-primary">{product.price} ₸</p>
      </CardContent>

      <CardFooter className="flex gap-2 p-4 pt-0">
        <form action={toggleAction}>
          <input type="hidden" name="id" value={product.id} />
          <input
            type="hidden"
            name="available"
            value={String(product.available)}
          />

          <Button
            type="submit"
            variant={product.available ? "default" : "outline"}
            className="flex-1"
          >
            {product.available ? "В наличии" : "Недоступен"}
          </Button>
        </form>
        <form
          action={deleteAction}
          onSubmit={(e) => {
            if (!confirm(`Удалить "${product.name}"?`)) {
              e.preventDefault()
            }
          }}
        >
          <input type="hidden" name="id" value={product.id} />

          <Button type="submit" variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
