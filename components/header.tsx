"use client"

import Link from "next/link"
import { ShoppingCart, Settings, Menu, X, LogOut, User } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const { itemCount } = useCart()
  const { user, signOut, isAdmin, isCashier } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartBounce, setCartBounce] = useState(false)
  const prevItemCount = useRef(itemCount)

  useEffect(() => {
    if (itemCount > prevItemCount.current) {
      setCartBounce(true)
      const timer = setTimeout(() => setCartBounce(false), 500)
      return () => clearTimeout(timer)
    }
    prevItemCount.current = itemCount
  }, [itemCount])

  const navLinks = [
    { href: "/about", label: "О нас" },
    { href: "/contacts", label: "Контакты" },
  ]

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary sm:text-2xl">Домашняя Кухня</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/cart"
            className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground ${
              cartBounce ? "animate-bounce" : ""
            }`}
          >
            <ShoppingCart data-cart-icon className={`h-5 w-5 transition-transform ${cartBounce ? "scale-125" : ""}`} />
            <span>Корзина</span>
            {itemCount > 0 && (
              <span className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground transition-transform ${
                cartBounce ? "scale-125" : ""
              }`}>
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  <Settings className="h-4 w-4" />
                  <span>Админ</span>
                </Link>
              )}

              {isCashier && (
                <Link
                  href="/cashier"
                  className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  <User className="h-4 w-4" />
                  <span>Касса</span>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <User className="h-4 w-4" />
              <span>Войти</span>
            </Link>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/cart"
            className={`relative flex items-center rounded-lg p-2 text-foreground transition-all hover:bg-accent ${
              cartBounce ? "animate-bounce" : ""
            }`}
          >
            <ShoppingCart data-cart-icon className={`h-5 w-5 transition-transform ${cartBounce ? "scale-125" : ""}`} />
            {itemCount > 0 && (
              <span className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground transition-transform ${
                cartBounce ? "scale-125" : ""
              }`}>
                {itemCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-foreground hover:bg-accent"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Админ</span>
                  </Link>
                )}

                {isCashier && (
                  <Link
                    href="/cashier"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                  >
                    <User className="h-4 w-4" />
                    <span>Касса</span>
                  </Link>
                )}

                <div className="border-t border-border pt-2">
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    {user.email}
                  </p>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </Button>
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <User className="h-4 w-4" />
                <span>Войти</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
