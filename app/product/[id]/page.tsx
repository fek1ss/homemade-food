"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getProductById } from "@/actions/products"
import { getSlots } from "@/actions/slots"
import { getAcceptOrders } from "@/actions/settings"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Slot } from "@/types"
import { useParams } from "next/navigation"
import { addToCart } from "@/actions/cart"
import { Plus } from "lucide-react"

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<any>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [acceptOrders, setAcceptOrders] = useState(false)

  const handleAddToCart = () => {
    if (!product || !product.available) return

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  useEffect(() => {
    async function fetchData() {
      const [prod, slotList, ordersOpen] = await Promise.all([
        getProductById(id),
        getSlots(),
        getAcceptOrders(),
      ])
      setProduct(prod)
      setSlots(slotList)
      setAcceptOrders(ordersOpen)
    }
    fetchData()
  }, [id])

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Продукт не найден
        </h1>
        <Link
          href="/"
          className="mt-4 inline-block text-primary hover:underline"
        >
          Вернуться к меню
        </Link>
      </div>
    )
  }

  const whatsappMessage = `Здравствуйте! Хочу заказать:\n- ${product.name}\nИтого: ${product.price} ₸${
    selectedSlot ? `\nСлот: ${selectedSlot.time_range}` : ""
  }`

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к меню
      </Link>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
          {!product.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
              <span className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground">
                Нет в наличии
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-bold text-primary">
            {product.price} ₸
          </p>
          <p className="mt-4 text-pretty text-muted-foreground">
            {product.description}
          </p>

          {/* Слоты */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-foreground">
              Доступные слоты
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  className={`px-3 py-1 rounded-md text-sm ${
                    slot.available
                      ? selectedSlot?.id === slot.id
                        ? "bg-primary text-white"
                        : "bg-muted/50 text-foreground"
                      : "bg-muted text-muted-foreground line-through"
                  }`}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot.time_range}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {/* 🟢 WhatsApp */}
            <WhatsAppButton
              message={whatsappMessage}
              className="flex-1"
              disabled={!acceptOrders || !selectedSlot || !product.available}
            >
              Заказать через WhatsApp
            </WhatsAppButton>

            {/* 🛒 Корзина */}
            <button
              onClick={handleAddToCart}
              disabled={!product.available}
              className="flex items-center justify-center gap-2 px-4 rounded-lg border border-border hover:bg-muted transition disabled:opacity-50"
            >
              <Plus className="h-5 w-5" />В корзину
            </button>
          </div>

          {!acceptOrders && (
            <p className="mt-2 text-sm text-destructive">
              Приём заказов закрыт
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
