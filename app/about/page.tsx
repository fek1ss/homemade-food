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

      
    </div>
  )
}
