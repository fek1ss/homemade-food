import { createClient } from "@/lib/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, Settings, Clock } from "lucide-react"
import { AddProductForm } from "@/components/product-form/addProductForm"
import { AdminProductCard } from "@/components/admin-product-card"


export default async function AdminPage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="p-8">Ошибка загрузки: {error.message}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Панель администратора
        </h1>
        <p className="text-muted-foreground">
          Управление продуктами и системой
        </p>
      </div>

      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Продукты</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || 0}</div>
          </CardContent>
        </Card>

        {/* Заглушки */}
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm">Пользователи</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>—</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm">Заказы</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>—</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm">Слоты</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>—</CardContent>
        </Card>
      </div>

      {/* ➕ Форма добавления продукта */}
      <AddProductForm />

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