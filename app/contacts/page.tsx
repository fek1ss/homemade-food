import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const contacts = [
  {
    icon: Phone,
    title: "Телефон",
    value: "+7 (777) 123-45-67",
    href: "tel:+77771234567",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "+7 (777) 123-45-67",
    href: "https://wa.me/77771234567",
  },
  {
    icon: Mail,
    title: "Email",
    value: "info@domashnyaya-kuhnya.kz",
    href: "mailto:info@domashnyaya-kuhnya.kz",
  },
]

const workingHours = [
  { day: "Понедельник - Пятница", hours: "09:00 - 20:00" },
  { day: "Суббота", hours: "10:00 - 18:00" },
  { day: "Воскресенье", hours: "Выходной" },
]

export default function ContactsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
          Контакты
        </h1>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground">
          Свяжитесь с нами любым удобным способом. Мы всегда рады помочь!
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-6">
          {/* Contact Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {contacts.map((contact) => (
              <Card key={contact.title} className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <contact.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">{contact.title}</p>
                    <a 
                      href={contact.href}
                      className="font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {contact.value}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Address Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Адрес
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">г. Алматы, 9-й микрорайон, дом 12</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Рядом с магазином "Магнум"
              </p>
            </CardContent>
          </Card>

          {/* Working Hours Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Режим работы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workingHours.map((item) => (
                  <div key={item.day} className="flex justify-between">
                    <span className="text-muted-foreground">{item.day}</span>
                    <span className="font-medium text-foreground">{item.hours}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp CTA */}
          <Button asChild size="lg" className="w-full">
            <a 
              href="https://wa.me/77771234567?text=Здравствуйте! Хочу сделать заказ."
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Написать в WhatsApp
            </a>
          </Button>
        </div>

        {/* Map */}
        <div className="overflow-hidden rounded-xl border border-border">
          <iframe
            src="https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22pos%22%3A%7B%22lat%22%3A43.238949%2C%22lon%22%3A76.945465%2C%22zoom%22%3A16%7D%2C%22opt%22%3A%7B%22city%22%3A%22almaty%22%7D%2C%22org%22%3A%2270000001019549958%22%7D"
            width="100%"
            height="100%"
            className="min-h-[400px] lg:min-h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Карта 2ГИС - Алматы, 9-й микрорайон, 12"
          />
        </div>
      </div>
    </div>
  )
}
