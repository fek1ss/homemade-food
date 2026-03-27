import Link from "next/link"
import { Settings } from "lucide-react"
import { CartCounter } from "@/components/cart-counter"
import { getUserRole } from "@/actions/getUserRole"

export default async function Header() {
  const roleInfo = await getUserRole()

  return (
    <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Лого */}
        <Link href="/" className="text-lg sm:text-xl font-bold truncate">
          Домашняя Кухня
        </Link>

        {/* Навигация */}
        <nav className="flex items-center gap-3 sm:gap-4">
          
          {/* Главная — скрываем на мобилке */}
          <Link href="/" className="hidden sm:block">
            Главная
          </Link>

          {/* Корзина */}
          <Link href="/cart" className="flex items-center gap-2">
            <CartCounter />
            <span className="hidden sm:inline">Корзина</span>
          </Link>

          {/* Админ */}
          {(roleInfo.isAdmin || roleInfo.isCashier) && (
            <Link href="/admin" className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <span className="hidden sm:inline">Админ</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}