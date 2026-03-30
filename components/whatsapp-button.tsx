"use client"

import { Button } from "@/components/ui/button"
import { Slot, Product, CartItem } from "@/types"

interface Props {
  product?: Product
  cartItems?: CartItem[]
  selectedSlot?: Slot | null
  className?: string
  disabled?: boolean
}

export function WhatsAppButton({
  product,
  cartItems,
  selectedSlot,
  className,
  disabled,
}: Props) {
  const generateMessage = () => {
    // 🛒 Корзина
    if (cartItems && cartItems.length > 0) {
      const itemsList = cartItems
        .map((item) => `- ${item.name} (${item.quantity} шт)`)
        .join("\n")

      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )

      return `Здравствуйте! Хочу заказать:
${itemsList}
Итого: ${total} ₸
${selectedSlot ? `Слот: ${selectedSlot.time_range}` : ""}
Адрес:`
    }

    // 🍔 Один продукт
    if (product) {
      return `Здравствуйте! Хочу заказать:
- ${product.name}
Итого: ${product.price} ₸
${selectedSlot ? `Слот: ${selectedSlot.time_range}` : ""}
Адрес:`
    }

    return ""
  }

  const handleClick = () => {
    const message = encodeURIComponent(generateMessage())
    const phone = "+77774433047"

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank")
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      className={className}
    >
      Заказать через WhatsApp
    </Button>
  )
}