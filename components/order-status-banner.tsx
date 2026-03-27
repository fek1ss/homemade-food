"use client"
import { CheckCircle, XCircle } from "lucide-react"
import { useState, useEffect } from "react"

export function OrderStatusBanner({ initialValue }: { initialValue: boolean }) {
  const [isOpen, setIsOpen] = useState(initialValue)

  useEffect(() => {
    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent
      setIsOpen(customEvent.detail)
    }

    window.addEventListener("accept-orders-change", handleChange)
    return () =>
      window.removeEventListener("accept-orders-change", handleChange)
  }, [])

  return (
    <div
      className={`rounded-lg p-4 ${
        isOpen
          ? "bg-accent/50 text-accent-foreground"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {isOpen ? (
          <>
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Принимаем заказы</span>
          </>
        ) : (
          <>
            <XCircle className="h-5 w-5" />
            <span className="font-medium">Сегодня заказы не принимаются</span>
          </>
        )}
      </div>
    </div>
  )
}
