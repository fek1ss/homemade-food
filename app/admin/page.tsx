"use client"

import { AdminHeader } from "@/components/admin/AdminHeader"
import { OrderStatusToggle } from "@/components/admin/OrderStatusToggle"
import { SlotsManager } from "@/components/admin/SlotsManager"
import { ProductsStats } from "@/components/admin/ProductsStats"
import { AddProductForm } from "@/components/admin/AddProductForm"
import { ProductsGrid } from "@/components/admin/ProductsGrid"
import { UserManagement } from "@/components/admin/UserManagement"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="container mx-auto px-4 py-8">
        <AdminHeader />
        <OrderStatusToggle />
        <SlotsManager />
        <ProductsStats />
        <AddProductForm />

        <section className="mb-8">
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            Управление продуктами
          </h2>
          <ProductsGrid />
        </section>

        <section>
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            Управление пользователями
          </h2>
          <UserManagement />
        </section>
      </div>
    </ProtectedRoute>
  )
}