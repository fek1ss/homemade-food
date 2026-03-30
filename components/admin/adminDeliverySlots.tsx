"use client"

import { Switch } from "@/components/ui/switch"
import { AddSlotForm } from "./addSlotForm"
import { toggleSlot, deleteSlot } from "@/actions/slots"
import { useEffect, useState } from "react"
import { useAppStore } from "@/store/useAppStore"
import { Slot } from "@/types"
import { Button } from "../ui/button"

interface Props {
  initialSlots: Slot[]
}

export function AdminDeliverySlotsCC({ initialSlots }: Props) {
  const { slots, setSlots, loadingSlotId, setLoadingSlotId } = useAppStore()
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())

  // Инициализация глобального состояния
  useEffect(() => {
    if (!slots && initialSlots) setSlots(initialSlots)
  }, [initialSlots])

  if (!slots) return null

  const handleToggle = async (id: number, available: boolean) => {
    if (loadingSlotId === id) return
    setLoadingSlotId(id)

    setSlots(slots.map(s => (s.id === id ? { ...s, available: !available } : s)))

    try {
      await toggleSlot(id, available)
    } catch (err) {
      console.error(err)
      setSlots(slots.map(s => (s.id === id ? { ...s, available } : s)))
    } finally {
      setLoadingSlotId(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (deletingIds.has(id)) return // защита от двойного клика
    setDeletingIds(new Set(deletingIds).add(id))

    try {
      await deleteSlot(id)
      setSlots(slots.filter(s => s.id !== id))
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <AddSlotForm onAdded={(newSlot) => setSlots([...slots, newSlot])} />

      <div className="flex flex-col gap-2">
        {slots.map((slot) => {
          const isDeleting = deletingIds.has(slot.id)
          return (
            <div
              key={slot.id}
              className="flex items-center justify-between gap-2 border p-2 rounded"
            >
              {/* Левая часть: Switch + текст */}
              <div className="flex items-center gap-2">
                <Switch
                  checked={slot.available}
                  onCheckedChange={() => handleToggle(slot.id, slot.available)}
                  disabled={loadingSlotId === slot.id || isDeleting}
                />
                <span>{slot.time_range}</span>
              </div>

              {/* Правая часть: кнопка удалить */}
              <Button
                variant="destructive"
                onClick={() => handleDelete(slot.id)}
                disabled={isDeleting}
              >
                {isDeleting ? "Удаляем..." : "Удалить"}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}