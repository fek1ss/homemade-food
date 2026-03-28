"use client"

import { useState, useEffect } from "react"
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
import { getSlots } from "@/actions/slots"
import { getAcceptOrders } from "@/actions/settings"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Slot } from "@/types"

export default function CartPage() {
  const [cartItems, setCartItems] = useState(() => getCart())
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [acceptOrders, setAcceptOrders] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  useEffect(() => {
    async function fetchData() {
      try {
        const [slotsData, accept] = await Promise.all([
          getSlots(),
          getAcceptOrders(),
        ])
        setSlots(slotsData)
        setAcceptOrders(accept)
      } catch {
        setError("Ошибка загрузки данных")
      }
    }
    fetchData()
  }, [])

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

  const generateWhatsAppMessage = () => {
    if (cartItems.length === 0 || !selectedSlot) return ""

    const itemsList = cartItems
      .map((item) => `- ${item.name} (${item.quantity} шт)`)
      .join("\n")

    return `Здравствуйте! Хочу заказать:
${itemsList}
Итого: ${totalPrice} ₸
Время доставки: ${selectedSlot.time_range}`
  }

  // 🟡 Пустая корзина
  if (cartItems.length === 0)
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          Корзина пуста
        </h1>
        <p className="mt-2 text-muted-foreground">Добавьте блюда в корзину</p>
        <Link href="/">
          <Button className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Перейти к меню
          </Button>
        </Link>
      </div>
    )

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Продолжить покупки
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-foreground">
        Ваша корзина
      </h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 🛒 Товары */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex gap-4 p-4 items-center">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/product/${item.id}`}
                      className="font-semibold text-foreground hover:text-primary"
                    >
                      {item.name}
                    </Link>

                    {/* 🔥 КРАСИВЫЕ КНОПКИ */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Количество:
                      </span>

                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          className="px-3 py-1 text-lg hover:bg-muted disabled:opacity-40"
                          onClick={() =>
                            handleQuantityChange(item.id, -1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>

                        <span className="px-3 py-1 min-w-[32px] text-center">
                          {item.quantity}
                        </span>

                        <button
                          className="px-3 py-1 text-lg hover:bg-muted"
                          onClick={() =>
                            handleQuantityChange(item.id, 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-lg font-bold text-primary mt-2">
                    {item.price * item.quantity} ₸
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemove(item.id)}
                >
                  <Trash2 className="h-5 w-5" />
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
              <h2 className="text-lg font-semibold mb-3">
                Выберите время
              </h2>

              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => {
                  const isActive = selectedSlot?.id === slot.id

                  return (
                    <button
                      key={slot.id}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot)}
                      className={`
                        px-3 py-1.5 rounded-lg text-sm transition
                        ${
                          slot.available
                            ? isActive
                              ? "bg-primary text-white"
                              : "bg-muted hover:bg-muted/70"
                            : "bg-muted text-muted-foreground line-through cursor-not-allowed"
                        }
                      `}
                    >
                      {slot.time_range}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* 💰 Итог */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">Итого заказа</h2>

              <div className="mt-4 flex flex-col gap-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x{item.quantity}
                    </span>
                    <span>{item.price * item.quantity} ₸</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t pt-4 flex justify-between">
                <span className="text-lg font-semibold">Итого</span>
                <span className="text-2xl font-bold text-primary">
                  {totalPrice} ₸
                </span>
              </div>

              <WhatsAppButton
                message={generateWhatsAppMessage()}
                className="mt-6 w-full"
                disabled={!acceptOrders || !selectedSlot}
              >
                Заказать через WhatsApp
              </WhatsAppButton>

              {!acceptOrders && (
                <p className="mt-2 text-sm text-destructive">
                  Приём заказов закрыт
                </p>
              )}

              {!selectedSlot && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Выберите слот времени
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}