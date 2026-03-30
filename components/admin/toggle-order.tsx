"use client"

import { Switch } from "@/components/ui/switch"
import { useAppStore } from "@/store/useAppStore"
import { toggleAcceptOrders } from "@/actions/settings"
import { useEffect } from "react"

interface Props {
  initialValue: boolean
}

export function AcceptOrdersToggleCC({ initialValue }: Props) {
  const { acceptOrders, setAcceptOrders, loading, setLoading } = useAppStore()

  useEffect(() => {
    if (acceptOrders === null && initialValue !== undefined) {
      setAcceptOrders(initialValue)
    }
  }, [initialValue, acceptOrders, setAcceptOrders])

  const handleToggle = async () => {
    if (loading) return
    setLoading(true)

    try {
      const newValue = await toggleAcceptOrders() 
      if (newValue !== null) {
        setAcceptOrders(newValue)
      }
    } finally {
      setLoading(false)
    }
  }

  if (acceptOrders === null) return null

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={acceptOrders}
        onCheckedChange={handleToggle}
        disabled={loading}
      />
      <span>
        {acceptOrders
          ? "Прием заказов включен"
          : "Прием заказов выключен"}
      </span>
    </div>
  )
}