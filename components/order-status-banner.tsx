// components/order-status-banner.tsx
import { CheckCircle, XCircle } from "lucide-react"
import { getAcceptOrders } from "@/actions/settings"

export async function OrderStatusBanner() {
  const isOpen = await getAcceptOrders()

  return (
    <div
      className={`rounded-lg p-4 ${
        isOpen
          ? "bg-accent/50 text-accent-foreground"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {isOpen ? (
          <>
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Принимаем заказы</span>
          </>
        ) : (
          <>
            <XCircle className="h-5 w-5" />
            <span className="font-medium">Сегодня заказы не принимаются</span>
          </>
        )}
      </div>
    </div>
  )
}