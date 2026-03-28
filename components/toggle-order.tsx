"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { toggleAcceptOrders } from "@/actions/settings"

export function AcceptOrdersToggle({
  initialValue,
}: {
  initialValue: boolean
}) {
  const [acceptOrders, setAcceptOrders] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const newValue = await toggleAcceptOrders()
      if (newValue !== null) {
        setAcceptOrders(newValue)
        window.dispatchEvent(
          new CustomEvent("accept-orders-change", { detail: newValue }),
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={acceptOrders}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
      <span>
        {acceptOrders ? "Прием заказов включен" : "Прием заказов выключен"}
      </span>
    </div>
  )
}
