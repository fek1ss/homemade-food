// app/admin/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { AddProductForm } from "@/components/admin/addProductForm"
import { AdminProductCard } from "@/components/admin/adminProductCard"
import { LogoutButton } from "@/components/logout-button"
import { AcceptOrdersToggleCC } from "@/components/admin/toggle-order"
import { AdminDeliverySlotsCC } from "@/components/admin/adminDeliverySlots"
import { ProductStats } from "@/components/admin/productStats"
import { getSlots } from "@/actions/slots"
import { getProducts } from "@/actions/products"
import { getUserRole } from "@/actions/getUserRole"
import { getAcceptOrders } from "@/actions/settings"
import { getCurrentUser, getUsers } from "@/actions/user"
import { AddUserForm } from "@/components/admin/addUserForm"
import { UserList } from "@/components/admin/userList"


// SC: кешируем на 1 минуту
export const revalidate = 60

export default async function AdminPage() {
  // Server Component: сразу получаем данные с сервера
  const [products, slots, acceptOrders, userRole, users, currentUser] = await Promise.all([
    getProducts(),
    getSlots(),
    getAcceptOrders(),
    getUserRole(),
    getUsers(),
    getCurrentUser(),
  ])

  const { isAdmin, isCashier } = userRole

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
          <AcceptOrdersToggleCC initialValue={acceptOrders} />
        </CardContent>
      </Card>

      {/* Слоты */}
      <Card className="mb-8">
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm">Слоты</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <AdminDeliverySlotsCC initialSlots={slots} />
        </CardContent>
      </Card>

      {
        isAdmin && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Пользователи</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <AddUserForm />
              <UserList users={users} currentUser={currentUser} />
            </CardContent>
          </Card> 
        )
      }

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