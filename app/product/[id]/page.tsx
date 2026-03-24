"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { useProducts } from "@/context/products-context"
import { useCart } from "@/context/cart-context"
import { useOrder } from "@/context/order-context"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { TimeSlotPicker } from "@/components/time-slot-picker"
import { OrderStatusBanner } from "@/components/order-status-banner"
import { Button } from "@/components/ui/button"

// TODO: Supabase integration
// - Fetch single product: supabase.from('products').select('*').eq('id', id).single()
// - Images should be served from Supabase Storage

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const { getProductById } = useProducts()
  const { addToCart } = useCart()
  const { orderSettings, selectedSlot } = useOrder()

  const product = getProductById(id)
  const canOrder = orderSettings.isOpen && product?.isAvailable

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">Продукт не найден</h1>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline">
          Вернуться к меню
        </Link>
      </div>
    )
  }

  const whatsappMessage = `Здравствуйте! Хочу заказать:\n- ${product.name}\nИтого: ${product.price} ₸${selectedSlot ? `\nВремя: ${selectedSlot.time}` : ""}`

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к меню
      </Link>

      {/* Product Details */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {!product.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
              <span className="rounded-lg bg-destructive px-6 py-3 text-lg font-semibold text-destructive-foreground">
                Нет в наличии
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 text-3xl font-bold text-primary">
            {product.price} ₽
          </p>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-foreground">Описание</h2>
            <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Order Status */}
          <div className="mt-6">
            <OrderStatusBanner />
          </div>

          {/* Time Slot Picker */}
          {canOrder && (
            <TimeSlotPicker className="mt-6" />
          )}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <WhatsAppButton 
              message={whatsappMessage} 
              className="flex-1"
              disabled={!canOrder || !selectedSlot}
            >
              Заказать через WhatsApp
            </WhatsAppButton>

            <Button
              onClick={() => addToCart(product)}
              disabled={!canOrder}
              variant="outline"
              className="flex-1"
            >
              <Plus className="mr-2 h-5 w-5" />
              Добавить в корзину
            </Button>
          </div>

          {!orderSettings.isOpen && (
            <p className="mt-4 text-sm text-destructive">
              Сегодня заказы не принимаются. Пожалуйста, попробуйте завтра.
            </p>
          )}

          {!product.isAvailable && orderSettings.isOpen && (
            <p className="mt-4 text-sm text-destructive">
              К сожалению, этот продукт сейчас недоступен. Пожалуйста, попробуйте позже или свяжитесь с нами.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
