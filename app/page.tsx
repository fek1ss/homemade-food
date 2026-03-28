import { ProductCard } from "@/components/product-card"
import { OrderStatusBanner } from "@/components/order-status-banner"
import { getProducts } from "@/actions/products"
import { getAcceptOrders } from "@/actions/settings"
import { ProductGrid } from "@/components/product-grid"
import { getSlots } from "@/actions/slots"

// Кешировать главную страницу на 5 минут
export const revalidate = 300

export default async function HomePage() {
  // Загружаем продукты и статус заказов параллельно
  const [products, slots, acceptOrders] = await Promise.all([
    getProducts(),
    getSlots(),
    getAcceptOrders(),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Order Status Banner */}
      <div className="mb-8">
        <OrderStatusBanner initialValue={acceptOrders} />
      </div>

      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Домашняя еда с любовью
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
          Приготовлено по семейным рецептам из свежих продуктов. Заказывайте
          через WhatsApp и получайте вкусную еду прямо к вашему столу.
        </p>
      </section>

      {/* Products Grid */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-foreground">
          Наше меню
        </h2>

        {!products || products.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
            <p className="text-muted-foreground">
              Приносим извинения, меню временно недоступно
            </p>
          </div>
        ) : (
          <ProductGrid
            initialProducts={products}
            initialSlots={slots}
            initialAcceptOrders={acceptOrders}
          />
        )}
      </section>
    </div>
  )
}
