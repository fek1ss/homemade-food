import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/context/products-context"
import { uploadImage } from "@/api/products"
import type { Product } from "@/types"

type FormState = {
  name: string
  description: string
  price: string
  imageFile: File | null
}

export function AddProductForm() {
  const { addProduct } = useProducts()
  const [state, setState] = useState<FormState>({ name: "", description: "", price: "", imageFile: null })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!state.name || !state.price || !state.imageFile) {
      setError("Заполните все обязательные поля")
      return
    }

    const priceNumber = Number(state.price)
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      setError("Цена должна быть положительным числом")
      return
    }

    setIsSubmitting(true)
    try {
      const imageUrl = await uploadImage(state.imageFile)
      const newProduct: Omit<Product, "id"> = {
        name: state.name,
        description: state.description,
        price: priceNumber,
        image: imageUrl,
        isAvailable: true,
      }
      await addProduct(newProduct)
      setSuccess(true)
      setState({ name: "", description: "", price: "", imageFile: null })
    } catch (err: any) {
      setError(err?.message || "Ошибка при добавлении продукта")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mb-8 rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">Добавить новое блюдо</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Название блюда</Label>
          <Input
            id="name"
            value={state.name}
            onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            value={state.description}
            onChange={(e) => setState((s) => ({ ...s, description: e.target.value }))}
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="price">Цена (₽)</Label>
          <Input
            id="price"
            type="number"
            min={1}
            value={state.price}
            onChange={(e) => setState((s) => ({ ...s, price: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="image">Изображение</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setState((s) => ({ ...s, imageFile: e.target.files?.[0] ?? null }))}
            required
          />
          {state.imageFile && <p className="mt-1 text-sm text-muted-foreground">Выбран: {state.imageFile.name}</p>}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-green-600">Продукт успешно добавлен</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Добавление..." : "Добавить продукт"}
        </Button>
      </form>
    </div>
  )
}