"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useOrder } from "@/context/order-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, CheckCircle, XCircle } from "lucide-react"
import { Loader2 } from "lucide-react"

export default function CashierPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { orderSettings, slots, updateSlot } = useOrder()

  // Проверка доступа
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'cashier')) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  const handleToggleSlot = async (slotId: string | number, isActive: boolean) => {
    await updateSlot(slotId, { isActive })
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || user.role !== 'cashier') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Панель кассира
        </h1>
        <p className="mt-2 text-muted-foreground">
          Управление заказами и слотами доставки
        </p>
        <div className="mt-4 flex items-center gap-4">
          <Badge variant={orderSettings.isOpen ? "default" : "secondary"}>
            {orderSettings.isOpen ? "Приём заказов открыт" : "Приём заказов закрыт"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {user.email}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего слотов</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{slots.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активных слотов</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {slots.filter(slot => slot.isActive).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Текущих заказов</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {slots.reduce((total, slot) => total + slot.currentOrders, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Slots Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Управление слотами доставки
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="flex flex-col gap-4 rounded-lg border border-border p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">
                    {slot.time}
                  </span>
                  <Badge variant={slot.isActive ? "default" : "secondary"}>
                    {slot.isActive ? "Активен" : "Неактивен"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Заказов:</span>
                  <span className="font-medium">
                    {slot.currentOrders} / {slot.maxOrders}
                  </span>
                </div>

                <Button
                  onClick={() => handleToggleSlot(slot.id, !slot.isActive)}
                  variant={slot.isActive ? "destructive" : "default"}
                  size="sm"
                >
                  {slot.isActive ? (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Закрыть слот
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Открыть слот
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}