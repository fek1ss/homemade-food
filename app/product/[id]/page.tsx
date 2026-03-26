// app/product/[id]/page.tsx
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getProductById } from "@/actions/products"
import { getSlots } from '@/actions/slots';

interface ProductPageProps {
  params: { id: string }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  const product = await getProductById(id)
  const slots = await getSlots()

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">Продукт не найден</h1>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline">
          Вернуться к меню
        </Link>
      </div>
    )
  }

  const whatsappMessage = `Здравствуйте! Хочу заказать:\n- ${product.name}\nИтого: ${product.price} ₸`

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Назад к меню
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width:1024px)100vw,50vw" />
          {!product.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
              <span className="rounded-lg bg-destructive px-6 py-3 text-lg font-semibold text-destructive-foreground">
                Нет в наличии
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-primary">{product.price} ₸</p>
          <p className="mt-4 text-pretty text-muted-foreground">{product.description}</p>

          {/* Слоты */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-foreground">Доступные слоты</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {slots.map(slot => (
                <li
                  key={slot.id}
                  className={`px-3 py-1 rounded-md text-sm ${
                    slot.available ? "bg-primary text-white" : "bg-muted text-muted-foreground line-through"
                  }`}
                >
                  {slot.time_range}
                </li>
              ))}
            </ul>
          </div>

          {/* WhatsApp */}
          <div className="mt-8 flex gap-4">
            <WhatsAppButton message={whatsappMessage} className="flex-1" disabled={!product.available}>
              Заказать через WhatsApp
            </WhatsAppButton>
            <Button variant="outline" disabled={!product.available} className="flex-1">
              <Plus className="mr-2 h-5 w-5" /> Добавить в корзину
            </Button>
          </div>

          {!product.available && (
            <p className="mt-4 text-sm text-destructive">К сожалению, этот продукт сейчас недоступен.</p>
          )}
        </div>
      </div>
    </div>
  )
}