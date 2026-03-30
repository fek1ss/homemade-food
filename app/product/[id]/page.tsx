import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getProductById } from "@/actions/products"
import { getSlots } from "@/actions/slots"
import { getAcceptOrders } from "@/actions/settings"
import { ProductClient } from "@/components/product-client"

// кеш
export const revalidate = 300

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
   const [product, slots, acceptOrders] = await Promise.all([
    getProductById(id),
    getSlots(),
    getAcceptOrders(),
  ])

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Продукт не найден</h1>
        <Link href="/">Назад</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к меню
      </Link>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative overflow-hidden rounded-xl h-64 sm:h-80 lg:h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <ProductClient
          product={product}
          slots={slots}
          acceptOrders={acceptOrders}
        />
      </div>
    </div>
  )
}