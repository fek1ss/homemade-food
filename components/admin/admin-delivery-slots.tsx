"use client"

import { Switch } from "@/components/ui/switch"
import { AddSlotForm } from "./addSlotForm"
import { toggleSlot } from "@/actions/slots"
import { useEffect } from "react"
import { useAppStore } from "@/store/useAppStore"
import { Slot } from "@/types"

interface Props {
  initialSlots: Slot[]
}

export function AdminDeliverySlotsCC({ initialSlots }: Props) {
  const { slots, setSlots, loadingSlotId, setLoadingSlotId } = useAppStore()

  // Инициализация глобального состояния
  useEffect(() => {
    if (!slots && initialSlots) setSlots(initialSlots)
  }, [initialSlots])

  if (!slots) return null

  const handleToggle = async (id: number, available: boolean) => {
    if (loadingSlotId === id) return
    setLoadingSlotId(id)

    try {
      await toggleSlot(id, available)
      setSlots(slots.map(s => (s.id === id ? { ...s, available: !available } : s)))
    } finally {
      setLoadingSlotId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <AddSlotForm onAdded={(newSlot) => setSlots([...slots, newSlot])} />
      <div className="flex flex-col gap-2">
        {slots.map((slot) => (
          <div key={slot.id} className="flex items-center gap-2">
            <Switch
              checked={slot.available}
              onCheckedChange={() => handleToggle(slot.id, slot.available)}
              disabled={loadingSlotId === slot.id}
            />
            <span>{slot.time_range}</span>
          </div>
        ))}
      </div>
    </div>
  )
}