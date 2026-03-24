import { AdminProductCard } from "@/components/admin-product-card"
import { useProducts } from "@/context/products-context"

export function ProductsGrid() {
  const { products, loading } = useProducts()

  if (loading) {
    return <p className="text-muted-foreground">Загрузка продуктов...</p>
  }

  if (products.length === 0) {
    return <p className="text-muted-foreground">Нет продуктов. Добавьте первое блюдо.</p>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <AdminProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}