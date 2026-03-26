'use client'

import { Slot } from "@/types" // определяем интерфейс Slot
import { Switch } from "@/components/ui/switch"

interface DeliverySlotsProps {
  slots: Slot[]
}

export function DeliverySlots({ slots }: DeliverySlotsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {slots.map(slot => (
        <div
          key={slot.id}
          className={`px-4 py-2 rounded-lg border ${
            slot.available ? "border-green-500 bg-green-100" : "border-red-300 bg-red-50 text-red-500"
          }`}
        >
          {slot.time_range} {slot.available ? "(Доступен)" : "(Недоступен)"}
        </div>
      ))}
    </div>
  )
}