"use client"

import { useState } from "react"
import { mockSlots, mockOrders } from "@/data/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Clock, Users, CheckCircle, XCircle, Package } from "lucide-react"

export default function CashierPage() {
  const [slots, setSlots] = useState(mockSlots)
  const [orders] = useState(mockOrders)

  const handleToggleSlot = (slotId: number) => {
    setSlots(prev =>
      prev.map(slot =>
        slot.id === slotId ? { ...slot, isActive: !slot.isActive } : slot
      )
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'preparing': return 'bg-orange-100 text-orange-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'delivered': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего заказов</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активных слотов</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{slots.filter(s => s.isActive).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ожидают подтверждения</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Slots Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Управление слотами доставки</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {slots.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{slot.time}</p>
                  <p className="text-sm text-muted-foreground">
                    Макс. заказов: {slot.maxOrders}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`slot-${slot.id}`}
                    checked={slot.isActive}
                    onCheckedChange={() => handleToggleSlot(slot.id)}
                  />
                  <Label htmlFor={`slot-${slot.id}`}>
                    {slot.isActive ? "Активен" : "Неактивен"}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Заказы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">Заказ #{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status === 'pending' && 'Ожидает'}
                    {order.status === 'confirmed' && 'Подтвержден'}
                    {order.status === 'preparing' && 'Готовится'}
                    {order.status === 'ready' && 'Готов'}
                    {order.status === 'delivered' && 'Доставлен'}
                    {order.status === 'cancelled' && 'Отменен'}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground mb-2">
                  <p>Адрес: {order.deliveryAddress}</p>
                  <p>Слот: {slots.find(s => s.id === order.deliverySlotId)?.time}</p>
                  <p>Сумма: {order.totalAmount}₽</p>
                </div>

                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Подтвердить
                    </Button>
                  )}
                  {order.status === 'confirmed' && (
                    <Button size="sm" variant="outline">
                      Готовится
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button size="sm" variant="outline">
                      Готов
                    </Button>
                  )}
                  {order.status === 'ready' && (
                    <Button size="sm" variant="outline">
                      Доставлен
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-foreground">
//           Панель кассира
//         </h1>
//         <p className="mt-2 text-muted-foreground">
//           Управление заказами и слотами доставки
//         </p>
//         <div className="mt-4 flex items-center gap-4">
//           <Badge variant={orderSettings.isOpen ? "default" : "secondary"}>
//             {orderSettings.isOpen ? "Приём заказов открыт" : "Приём заказов закрыт"}
//           </Badge>
//           <span className="text-sm text-muted-foreground">
//             {user.email}
//           </span>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="mb-8 grid gap-4 sm:grid-cols-3">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Всего слотов</CardTitle>
//             <Clock className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{slots.length}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Активных слотов</CardTitle>
//             <CheckCircle className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {slots.filter(slot => slot.isActive).length}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Текущих заказов</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {slots.reduce((total, slot) => total + slot.currentOrders, 0)}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Time Slots Management */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Clock className="h-5 w-5" />
//             Управление слотами доставки
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {slots.map((slot) => (
//               <div
//                 key={slot.id}
//                 className="flex flex-col gap-4 rounded-lg border border-border p-4"
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="text-lg font-semibold text-foreground">
//                     {slot.time}
//                   </span>
//                   <Badge variant={slot.isActive ? "default" : "secondary"}>
//                     {slot.isActive ? "Активен" : "Неактивен"}
//                   </Badge>
//                 </div>

//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">Заказов:</span>
//                   <span className="font-medium">
//                     {slot.currentOrders} / {slot.maxOrders}
//                   </span>
//                 </div>

//                 <Button
//                   onClick={() => handleToggleSlot(slot.id, !slot.isActive)}
//                   variant={slot.isActive ? "destructive" : "default"}
//                   size="sm"
//                 >
//                   {slot.isActive ? (
//                     <>
//                       <XCircle className="mr-2 h-4 w-4" />
//                       Закрыть слот
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle className="mr-2 h-4 w-4" />
//                       Открыть слот
//                     </>
//                   )}
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }