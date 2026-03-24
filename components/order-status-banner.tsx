"use client"

import { CheckCircle, XCircle } from "lucide-react"

interface OrderStatusBannerProps {
  isOpen?: boolean
}

export function OrderStatusBanner({ isOpen = true }: OrderStatusBannerProps) {
  return (
    <div
      className={`rounded-lg p-4 ${
        isOpen
          ? "bg-accent/50 text-accent-foreground"
          : "bg-destructive/10 text-destructive"
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
