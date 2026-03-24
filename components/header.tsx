import Link from "next/link"
import { ShoppingCart, Settings, User } from "lucide-react"
import { createClient } from "@/lib/server"
import { signOut } from "@/actions/auth"

export async function Header() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const role = user?.user_metadata?.role

  const isAdmin = role === "admin"
  const isCashier = role === "cashier"

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Домашняя Кухня
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/cart" className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Корзина
          </Link>

          {(isAdmin || isCashier) && (
            <>
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Админ
                </Link>
              )}

              <Link href="/cashier" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Касса
              </Link>

              <form action={signOut}>
                <button className="px-3 py-1 bg-red-600 text-white rounded-md">
                  Выйти
                </button>
              </form>
            </>
          )}

          {!user && (
            <Link href="/login" className="px-3 py-1 border rounded-md">
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}