"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Product } from "@/types"
import { supabase } from "@/lib/supabase"
import { createProduct as apiCreateProduct } from "@/api/products"

interface ProductsContextType {
  products: Product[]
  loading: boolean
  error: string | null
  refreshProducts: () => void
  updateAvailability: (productId: number, isAvailable: boolean) => Promise<void>
  deleteProduct: (productId: number) => Promise<void>
  addProduct: (product: Omit<Product, "id">) => Promise<void>
  getProductById: (id: number) => Product | undefined
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id")

      if (error) throw error

      // ✅ НОРМАЛЬНЫЙ МАППИНГ ПОД ТИПЫ
      const parsed: Product[] = (data ?? []).map((item: any) => ({
        id: item.id, // number
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        isAvailable: item.available,
      }))

      setProducts(parsed)
    } catch (err: any) {
      setError(err?.message || "Не удалось загрузить продукты")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const refreshProducts = () => loadProducts()

  const updateAvailability = async (productId: number, isAvailable: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ available: isAvailable })
      .eq("id", productId)

    if (error) {
      console.error("Не удалось обновить наличие", error)
      return
    }

    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, isAvailable } : item
      )
    )
  }

  const deleteProduct = async (productId: number) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)

    if (error) {
      console.error("Не удалось удалить продукт", error)
      return
    }

    setProducts((prev) => prev.filter((item) => item.id !== productId))
  }

  const addProduct = async (product: Omit<Product, "id">) => {
    await apiCreateProduct(product)
    await refreshProducts()
  }

  const getProductById = (id: number) =>
    products.find((product) => product.id === id)

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        refreshProducts,
        updateAvailability,
        deleteProduct,
        addProduct,
        getProductById,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}