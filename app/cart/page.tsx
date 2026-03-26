"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getCart, removeFromCart, clearCart } from "@/actions/cart"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = () => {
    try {
      setLoading(true)
      const data = getCart()
      setCartItems(data || [])
    } catch (e) {
      setError("Ошибка загрузки корзины")
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = (productId: number) => {
    try {
      removeFromCart(productId)
      fetchCart()
    } catch {
      setError("Ошибка удаления товара")
    }
  }

  const handleClearCart = () => {
    try {
      clearCart()
      fetchCart()
    } catch {
      setError("Ошибка очистки корзины")
    }
  }

  const generateWhatsAppMessage = () => {
    if (cartItems.length === 0) return ""

    const itemsList = cartItems
      .map((item) => `- ${item.name} (${item.quantity} шт)`)
      .join("\n")

    return `Здравствуйте! Хочу заказать:\n${itemsList}\nИтого: ${totalPrice} ₸`
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  if (loading) return <p>Загрузка корзины...</p>

  if (cartItems.length === 0)
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Корзина пуста</h1>
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
        className="mb-6 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
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
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
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
                      {item.price * item.quantity} ₸
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemove(item.id)}
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
            onClick={handleClearCart}
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
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="text-foreground">
                      {item.price * item.quantity} ₸
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

               <WhatsAppButton
                message={generateWhatsAppMessage()}
                className="mt-6 w-full"
                disabled={cartItems.length === 0}
              >
                Заказать через WhatsApp
              </WhatsAppButton>

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