import Link from "next/link"
import { ArrowLeft, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"

export function AdminHeader() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться к меню
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Администратор: {user?.email}
          </span>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-foreground mt-4">Панель администратора</h1>
      <p className="mt-2 text-muted-foreground">
        Управляйте заказами, слотами, продуктами и пользователями
      </p>
    </div>
  )
}