"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useOrder } from "@/context/order-context"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { TimeSlotPicker } from "@/components/time-slot-picker"
import { OrderStatusBanner } from "@/components/order-status-banner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CartPage() {
  const { items, removeFromCart, totalPrice, clearCart } = useCart()
  const { orderSettings, selectedSlot } = useOrder()

  const generateWhatsAppMessage = () => {
    if (items.length === 0) return ""

    const itemsList = items
      .map((item) => `- ${item.name} (${item.quantity} шт)`)
      .join("\n")

    let message = `Здравствуйте! Хочу заказать:\n${itemsList}\nИтого: ${totalPrice} ₸`
    
    if (selectedSlot) {
      message += `\nВремя: ${selectedSlot.time}`
    }

    return message
  }

  const canOrder = orderSettings.isOpen && items.length > 0 && selectedSlot !== null

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-md">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold text-foreground">
            Корзина пуста
          </h1>
          <p className="mt-2 text-muted-foreground">
            Добавьте вкусные блюда из нашего меню
          </p>
          <Link href="/">
            <Button className="mt-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Перейти к меню
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Продолжить покупки
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-foreground">Ваша корзина</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex gap-4 p-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/product/${item.id}`}
                        className="font-semibold text-foreground transition-colors hover:text-primary"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Количество: {item.quantity}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-primary">
                      {item.price * item.quantity} ₽
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            variant="outline"
            className="mt-4"
            onClick={clearCart}
          >
            Очистить корзину
          </Button>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground">
                Итого заказа
              </h2>

              <div className="mt-4 flex flex-col gap-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="text-foreground">
                      {item.price * item.quantity} ₽
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-foreground">
                    Итого
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {totalPrice} ₸
                  </span>
                </div>
              </div>

              {/* Order Status */}
              <div className="mt-4">
                <OrderStatusBanner />
              </div>

              {/* Time Slot Picker */}
              {orderSettings.isOpen && (
                <TimeSlotPicker className="mt-4" />
              )}

              <WhatsAppButton
                message={generateWhatsAppMessage()}
                className="mt-6 w-full"
                disabled={!canOrder}
              >
                Заказать через WhatsApp
              </WhatsAppButton>

              {!selectedSlot && orderSettings.isOpen && (
                <p className="mt-2 text-center text-xs text-destructive">
                  Выберите время доставки для оформления заказа
                </p>
              )}

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Нажмите кнопку, чтобы отправить заказ через WhatsApp
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
