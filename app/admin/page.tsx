'use server'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { AddProductForm } from "@/components/product-form/addProductForm"
import { AdminProductCard } from "@/components/admin-product-card"
import { LogoutButton } from "@/components/logout-button"
import { AdminDeliverySlots } from "@/components/admin-delivery-slots"
import { AcceptOrdersToggle } from "@/components/toggle-order"
import { ProductStats } from "@/components/product-stats"
import { getSlots } from "@/actions/slots"
import { getProducts } from "@/actions/products"
import { getUserRole } from "@/actions/getUserRole"
import { getAcceptOrders } from "@/actions/settings"

export default async function AdminPage() {
  const [products, acceptOrders, slots, role] = await Promise.all([
    getProducts(),
    getAcceptOrders(),
    getSlots(),
    getUserRole(),
  ])

  const { isAdmin, isCashier } = role || {}

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок */}
      <div className="flex flex-col mb-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-foreground">
            Панель администратора
          </h1>
          <p className="text-muted-foreground">
            Управление продуктами и системой
          </p>
        </div>

        <LogoutButton />
      </div>

      {/* Статистика */}
      <ProductStats products={products || []} />

      {/* Приём заказов */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Приём заказов</CardTitle>
        </CardHeader>
        <CardContent>
          <AcceptOrdersToggle initialValue={acceptOrders} />
        </CardContent>
      </Card>

      {/* Слоты */}
      <Card className="mb-8">
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm">Слоты</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <AdminDeliverySlots initialSlots={slots || []} />
        </CardContent>
      </Card>

      {/* ➕ Форма добавления продукта — только для админа */}
      {isAdmin && <AddProductForm />}

      {/* 📦 Список продуктов */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Продукты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products?.map((product) => (
              <AdminProductCard key={product.id} product={product} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}