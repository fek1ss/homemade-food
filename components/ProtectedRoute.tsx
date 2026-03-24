"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { UserRole } from "@/types"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/auth/login"
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && user.role !== requiredRole) {
        // Редирект в зависимости от роли
        if (user.role === 'admin') {
          router.push('/admin')
        } else if (user.role === 'cashier') {
          router.push('/cashier')
        } else {
          router.push('/')
        }
        return
      }
    }
  }, [user, loading, requiredRole, router, redirectTo])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}