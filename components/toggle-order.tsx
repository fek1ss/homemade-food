'use client'

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { toggleAcceptOrders } from "@/actions/settings"

export function AcceptOrdersToggle({ initialValue }: { initialValue: boolean }) {
  const [acceptOrders, setAcceptOrders] = useState(initialValue)

  const handleToggle = async () => {
    const newValue = await toggleAcceptOrders()
    if (newValue !== null) setAcceptOrders(newValue)
  }

  return (
    <div className="flex items-center gap-2">
      <Switch checked={acceptOrders} onCheckedChange={handleToggle} />
      <span>
        {acceptOrders
          ? "Прием заказов включен"
          : "Прием заказов выключен"}
      </span>
    </div>
  )
}