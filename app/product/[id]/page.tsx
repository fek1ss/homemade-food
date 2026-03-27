// app/product/[id]/page.tsx
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getProductById } from "@/actions/products"
import { getSlots } from "@/actions/slots"

interface ProductPageProps {
  params: { id: string }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  const [product, slots] = await Promise.all([getProductById(id), getSlots()])

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Продукт не найден
        </h1>
        <Link
          href="/"
          className="mt-4 inline-block text-primary hover:underline"
        >
          Вернуться к меню
        </Link>
      </div>
    )
  }

  const whatsappMessage = `Здравствуйте! Хочу заказать:\n- ${product.name}\nИтого: ${product.price} ₸`

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Back */}
      <Link
        href="/"
        className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к меню
      </Link>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width:1024px)100vw,50vw"
          />

          {!product.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
              <span className="rounded-lg bg-destructive px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg font-semibold text-destructive-foreground">
                Нет в наличии
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {product.name}
          </h1>

          <p className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold text-primary">
            {product.price} ₸
          </p>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Слоты */}
          <div className="mt-5 sm:mt-6">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">
              Доступные слоты
            </h2>

            <ul className="mt-2 flex flex-wrap gap-2">
              {slots.map((slot) => (
                <li
                  key={slot.id}
                  className={`px-3 py-1 rounded-md text-xs sm:text-sm whitespace-nowrap ${
                    slot.available
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground line-through"
                  }`}
                >
                  {slot.time_range}
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <WhatsAppButton
              message={whatsappMessage}
              className="w-full"
              disabled={!product.available}
            >
              Заказать через WhatsApp
            </WhatsAppButton>

            <Button
              variant="outline"
              disabled={!product.available}
              className="w-full"
            >
              <Plus className="mr-2 h-5 w-5" />
              Добавить в корзину
            </Button>
          </div>

          {/* Статус */}
          {!product.available && (
            <p className="mt-4 text-sm text-muted-foreground">
              К сожалению, этот продукт сейчас недоступен.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
