'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addSlot } from "@/actions/slots"

interface Slot {
  id: number
  time_range: string
  available: boolean
}

export function AddSlotForm({ onAdded }: { onAdded: (newSlot: Slot) => void }) {
  const [timeRange, setTimeRange] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async () => {
  if (!timeRange) return

  const result = await addSlot(timeRange)

  if (result?.error) {
    setError(result.error)
    return
  }

  if (result?.data) {
    onAdded(result.data) // 🔥 передаем новый слот наверх
  }

  setTimeRange("")
}

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          value={timeRange}
          onChange={e => setTimeRange(e.target.value)}
          placeholder="10:00"
        />
        <Button onClick={handleAdd}>Добавить слот</Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}