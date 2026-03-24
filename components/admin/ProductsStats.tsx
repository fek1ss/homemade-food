import { Package } from "lucide-react"
import { useProducts } from "@/context/products-context"

function StatCard({ iconColor, label, value }: { iconColor: string; label: string; value: number }) {
  return (
    <div className="rounded-lg bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`${iconColor} rounded-full p-2`}>
          <Package className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  )
}

export function ProductsStats() {
  const { products } = useProducts()
  const total = products.length
  const available = products.filter((p) => p.isAvailable).length
  const unavailable = total - available

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-3">
      <StatCard iconColor="bg-primary/10 text-primary" label="Всего продуктов" value={total} />
      <StatCard iconColor="bg-secondary/10 text-secondary-foreground" label="В наличии" value={available} />
      <StatCard iconColor="bg-destructive/10 text-destructive" label="Нет в наличии" value={unavailable} />
    </div>
  )
}