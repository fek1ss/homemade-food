"use client"

import { Clock } from "lucide-react"
import { useOrder, Slot } from "@/context/order-context"
import { Button } from "@/components/ui/button"

interface TimeSlotPickerProps {
  className?: string
}

export function TimeSlotPicker({ className }: TimeSlotPickerProps) {
  const { slots, selectedSlot, selectSlot, isSlotAvailable, orderSettings } = useOrder()

  const activeSlots = slots.filter((slot) => slot.isActive)

  if (!orderSettings.isOpen) {
    return null
  }

  return (
    <div className={className}>
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Выберите время доставки</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {activeSlots.map((slot) => {
          const available = isSlotAvailable(slot)
          const isSelected = selectedSlot?.id === slot.id

          return (
            <Button
              key={slot.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              disabled={!available}
              onClick={() => selectSlot(isSelected ? null : slot)}
              className={`min-w-[80px] ${
                !available ? "opacity-50" : ""
              }`}
            >
              <span>{slot.time}</span>
              {!available && (
                <span className="ml-1 text-xs">(Занято)</span>
              )}
            </Button>
          )
        })}
      </div>

      {activeSlots.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Нет доступных слотов для доставки
        </p>
      )}

      {selectedSlot && (
        <p className="mt-2 text-sm text-muted-foreground">
          Выбрано: {selectedSlot.time}
        </p>
      )}
    </div>
  )
}
