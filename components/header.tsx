import Link from "next/link"
import { Settings } from "lucide-react"
import { CartCounter } from "@/components/cart-counter"
import { getUserRole } from "@/actions/getUserRole"

export default async function Header() {
  const roleInfo = await getUserRole()

  return (
    <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Домашняя Кухня
        </Link>

        <nav className="flex items-center gap-4 flex-wrap">
          <Link href="/">Главная</Link>

          <Link href="/cart" className="flex items-center gap-2">
            <CartCounter /> {/* client компонент внутри server — это нормально */}
            Корзина
          </Link>

          {(roleInfo.isAdmin || roleInfo.isCashier) && (
            <Link href="/admin" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Админ
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}