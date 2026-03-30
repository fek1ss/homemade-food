"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "@/actions/cart"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Slot } from "@/types"

interface Props {
  initialSlots: Slot[]
  initialAcceptOrders: boolean
}

export function CartPageClient({
  initialSlots,
  initialAcceptOrders,
}: Props) {
  const [cartItems, setCartItems] = useState(() => getCart())
  const [slots] = useState(initialSlots)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [acceptOrders] = useState(initialAcceptOrders)
  const [error, setError] = useState<string | null>(null)

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleRemove = (productId: number) => {
    try {
      removeFromCart(productId)
      setCartItems(getCart())
    } catch {
      setError("Ошибка удаления товара")
    }
  }

  const handleQuantityChange = (productId: number, delta: number) => {
    try {
      updateCartQuantity(productId, delta)
      setCartItems(getCart())
    } catch {
      setError("Ошибка изменения количества")
    }
  }

  const handleClearCart = () => {
    try {
      clearCart()
      setCartItems([])
      setSelectedSlot(null)
    } catch {
      setError("Ошибка очистки корзины")
    }
  }

  // 🟡 Пустая корзина
  if (cartItems.length === 0)
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Корзина пуста</h1>
        <p className="mt-2 text-muted-foreground">Добавьте блюда</p>

        <Link href="/">
          <Button className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            В меню
          </Button>
        </Link>
      </div>
    )

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="mb-6 flex items-center gap-2 text-muted-foreground">
        <ArrowLeft className="h-4 w-4" />
        Продолжить покупки
      </Link>

      <h1 className="mb-8 text-3xl font-bold">Ваша корзина</h1>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 🛒 Товары */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex gap-4 p-4 items-center">
                <div className="relative h-24 w-24">
                  <Image src={item.image} alt={item.name} fill className="object-cover rounded-lg" />
                </div>

                <div className="flex-1">
                  <Link href={`/product/${item.id}`} className="font-semibold">
                    {item.name}
                  </Link>

                  {/* 🔥 quantity */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm">Количество:</span>

                    <div className="flex border rounded-lg overflow-hidden">
                      <button
                        className="px-3 py-1 hover:bg-muted"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>

                      <span className="px-3">{item.quantity}</span>

                      <button
                        className="px-3 py-1 hover:bg-muted"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 font-bold text-primary">
                    {item.price * item.quantity} ₸
                  </p>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => handleRemove(item.id)}
                >
                  <Trash2 />
                </Button>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={handleClearCart}>
            Очистить корзину
          </Button>
        </div>

        {/* 📦 Sidebar */}
        <div className="flex flex-col gap-4">
          {/* ⏰ Слоты */}
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-2">Выберите время</h2>

              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      selectedSlot?.id === slot.id
                        ? "bg-primary text-white"
                        : "bg-muted"
                    }`}
                  >
                    {slot.time_range}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 💰 Итог */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">Итого</h2>

              <div className="mt-4 flex flex-col gap-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{item.price * item.quantity} ₸</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t pt-4 flex justify-between">
                <span className="font-semibold">Итого</span>
                <span className="text-xl font-bold text-primary">
                  {totalPrice} ₸
                </span>
              </div>

              {/* 🔥 БЕЗ генерации строки */}
              <WhatsAppButton
                cartItems={cartItems}
                selectedSlot={selectedSlot}
                className="mt-6 w-full"
                disabled={!acceptOrders || !selectedSlot}
              />

              {!acceptOrders && (
                <p className="text-sm text-destructive mt-2">
                  Приём заказов закрыт
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}