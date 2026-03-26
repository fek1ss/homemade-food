'use client'

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { AddSlotForm } from "./slot-form/addSlotForm"
import { toggleSlot } from "@/actions/slots"

interface Slot {
  id: number
  time_range: string
  available: boolean
}

export function AdminDeliverySlots({ initialSlots }: { initialSlots: Slot[] }) {
  const [slots, setSlots] = useState<Slot[]>(initialSlots)

  const handleToggle = async (id: number, available: boolean) => {
    await toggleSlot(id, available)

    setSlots(prev =>
      prev.map(slot =>
        slot.id === id ? { ...slot, available: !available } : slot
      )
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <AddSlotForm
        onAdded={(newSlot) =>
          setSlots(prev => [...prev, newSlot]) // 🔥 добавляем новый слот сразу в UI
        }
      />

      <div className="flex flex-col gap-2">
        {slots.map(slot => (
          <div key={slot.id} className="flex items-center gap-2">
            <Switch
              checked={slot.available}
              onCheckedChange={() =>
                handleToggle(slot.id, slot.available)
              }
            />
            <span>{slot.time_range}</span>
          </div>
        ))}
      </div>
    </div>
  )
}