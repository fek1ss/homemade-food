import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useOrder } from "@/context/order-context"

export function SlotsManager() {
  const { slots, updateSlot } = useOrder()

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Управление слотами доставки
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-foreground">{slot.time}</span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    slot.isActive
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {slot.isActive ? "Активен" : "Неактивен"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Заказов:</span>
                  <span className="font-medium text-foreground">
                    {slot.currentOrders} / {slot.maxOrders}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Макс:</span>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={slot.maxOrders}
                    onChange={(e) => {
                      const next = Number(e.target.value)
                      if (Number.isFinite(next) && next >= 1) {
                        updateSlot(slot.id, { maxOrders: next })
                      }
                    }}
                    className="w-16"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Активен:</span>
                  <Switch
                    checked={slot.isActive}
                    onCheckedChange={(checked) => updateSlot(slot.id, { isActive: checked })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}