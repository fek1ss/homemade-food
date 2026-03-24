import Image from "next/image"
import { Heart, Leaf, Clock, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Heart,
    title: "С любовью",
    description: "Каждое блюдо готовится с душой и заботой о наших клиентах",
  },
  {
    icon: Leaf,
    title: "Натуральные продукты",
    description: "Используем только свежие и качественные ингредиенты",
  },
  {
    icon: Clock,
    title: "Быстрая доставка",
    description: "Доставляем горячую еду прямо к вашему столу",
  },
  {
    icon: Award,
    title: "Семейные рецепты",
    description: "Готовим по проверенным временем домашним рецептам",
  },
]

const galleryImages = [
  { src: "/images/about-food-1.jpg", alt: "Приготовление пельменей" },
  { src: "/images/about-food-2.jpg", alt: "Домашний борщ" },
  { src: "/images/about-food-3.jpg", alt: "Котлеты с пюре" },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
          <span className="text-balance">О нашей домашней кухне</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          <span className="text-pretty">
            Мы — небольшая семейная кухня, которая готовит вкусную домашнюю еду 
            по традиционным рецептам. Наша миссия — дарить людям тепло домашнего очага 
            через каждое блюдо.
          </span>
        </p>
      </section>

      {/* Features Grid */}
      <section className="mb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center">
              <CardContent className="p-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="mb-16">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
              Наша история
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Всё началось с любви к домашней кухне и желания поделиться этим теплом 
                с другими. Наши бабушки и мамы передали нам свои лучшие рецепты, 
                которые теперь мы готовим для вас.
              </p>
              <p>
                Каждое утро мы закупаем свежие продукты на местных рынках. 
                Никаких полуфабрикатов и консервантов — только натуральные ингредиенты 
                и ручной труд.
              </p>
              <p>
                Мы верим, что хорошая еда объединяет людей. Поэтому готовим так, 
                будто приглашаем вас к себе домой на обед.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/about-food-1.jpg"
              alt="Приготовление домашней еды"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section>
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
          Наши блюда
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="group relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-sm font-medium text-card">{image.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
