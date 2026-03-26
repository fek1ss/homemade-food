'use client'

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { getAcceptOrders, toggleAcceptOrders } from "@/actions/settings"

export function AcceptOrdersToggle() {
  const [acceptOrders, setAcceptOrders] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSetting() {
      const value = await getAcceptOrders()
      setAcceptOrders(value)
      setLoading(false)
    }

    fetchSetting()
  }, [])

  const handleToggle = async () => {
    const newValue = await toggleAcceptOrders()
    if (newValue !== null) setAcceptOrders(newValue)
  }

  if (loading) return null

  return (
    <div className="flex items-center gap-2">
      <Switch checked={acceptOrders} onCheckedChange={handleToggle} />
      <span>{acceptOrders ? "Прием заказов включен" : "Прием заказов выключен"}</span>
    </div>
  )
}