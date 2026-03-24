import { Power } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useOrder } from "@/context/order-context"

export function OrderStatusToggle() {
  const { orderSettings, setOrderOpen } = useOrder()

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Power className="h-5 w-5" />
          Статус приёма заказов
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">
              {orderSettings.isOpen ? "Принимаем заказы" : "Заказы закрыты"}
            </p>
            <p className="text-sm text-muted-foreground">
              {orderSettings.isOpen
                ? "Клиенты могут оформлять заказы"
                : "Клиенты не могут оформлять заказы"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {orderSettings.isOpen ? "Открыто" : "Закрыто"}
            </span>
            <Switch checked={orderSettings.isOpen} onCheckedChange={setOrderOpen} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}