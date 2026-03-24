"use client"

import Image from "next/image"
import { Product } from "@/types"
import { useProducts } from "@/context/products-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Check, X, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

interface AdminProductCardProps {
  product: Product
}

export function AdminProductCard({ product }: AdminProductCardProps) {
  const { updateAvailability } = useProducts()
  const [deleting, setDeleting] = useState(false)

  const handleToggle = () => {
    updateAvailability(product.id, !product.isAvailable)
  }

  const handleDelete = async () => {
    if (!confirm(`Вы уверены? Удалить "${product.name}"?`)) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', Number(product.id))

      if (error) {
        alert(`Ошибка: ${error.message}`)
      } else {
        alert('Продукт удален')
        window.location.reload()
      }
    } catch (err) {
      alert('Ошибка при удалении')
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

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
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-foreground/40" />
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-foreground">
          {product.name}
        </h3>
        <p className="mt-1 text-xl font-bold text-primary">{product.price} ₽</p>
      </CardContent>

      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button
          onClick={handleToggle}
          variant={product.isAvailable ? "default" : "outline"}
          className="flex-1"
        >
          {product.isAvailable ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              В наличии
            </>
          ) : (
            <>
              <X className="mr-2 h-4 w-4" />
              Не в наличии
            </>
          )}
        </Button>
        <Button
          onClick={handleDelete}
          disabled={deleting}
          variant="destructive"
          size="icon"
          title="Удалить"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
