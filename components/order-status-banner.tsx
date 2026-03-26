'use client'

import { useState, useEffect } from "react"
import { supabaseClient } from "@/lib/supabaseClient"
import { CheckCircle, XCircle } from "lucide-react"

export function OrderStatusBanner() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null)

  useEffect(() => {
    async function fetchStatus() {
      const { data, error } = await supabaseClient
        .from("settings")
        .select("accept_orders")
        .single()

      if (error) {
        console.error("Ошибка при получении статуса:", error)
        return
      }

      if (data) setIsOpen(data.accept_orders)
    }

    fetchStatus()
  }, [])

  if (isOpen === null) return null // пока данные не подгрузились

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