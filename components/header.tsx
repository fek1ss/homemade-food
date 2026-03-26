'use client'

import Link from "next/link";
import { Settings } from "lucide-react";
import { CartCounter } from "@/components/cart-counter";
import { useEffect, useState } from "react";
import { getUserRole } from "@/actions/getUserRole";

export default function Header() {
const [roleInfo, setRoleInfo] = useState<{ role: string | null; isAdmin: boolean; isCashier: boolean } | null>(null)

  useEffect(() => {
    async function fetchRole() {
      const info = await getUserRole()
      setRoleInfo(info)
    }
    fetchRole()
  }, [])

  if (roleInfo === null) return null


  return (
    <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Домашняя Кухня
        </Link>

        <nav className="flex items-center gap-4 flex-wrap">
          <Link href="/cart" className="flex items-center gap-2">
            <CartCounter />
            Корзина
          </Link>

          {(roleInfo.isAdmin || roleInfo.isCashier) && (
            <>
              {roleInfo.isAdmin && (
                <Link href="/admin" className="flex items-center gap-2 whitespace-nowrap">
                  <Settings className="h-4 w-4" />
                  Админ
                </Link>
              )}
            </>
          )}

          {!roleInfo.isAdmin && !roleInfo.isCashier && (
            <Link href="/login" className="px-3 py-1 border rounded-md whitespace-nowrap">
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}