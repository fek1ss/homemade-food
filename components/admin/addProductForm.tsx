'use client'

import { useActionState, useRef, useState } from "react"
import imageCompression from "browser-image-compression"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { addProduct } from "@/actions/products"

const initialState = { error: '' }

export function AddProductForm() {
  const [state, formAction] = useActionState(addProduct, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    if (loading) return
    setLoading(true)

    try {
      const file = formData.get("image") as File

      if (file && file.size > 0) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.3,       // 🔥 до 300KB
          maxWidthOrHeight: 800,
          useWebWorker: true,
        })

        formData.set("image", compressedFile)
      }

      await formAction(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-8 rounded-lg border border-border bg-card p-6">
      <h3 className="text-xl font-semibold mb-4">Добавить блюдо</h3>

      <form action={handleSubmit} className="space-y-4">

        <div>
          <Label htmlFor="name">Название</Label>
          <Input id="name" name="name" required />
        </div>

        <div>
          <Label htmlFor="description">Описание</Label>
          <Textarea id="description" name="description" />
        </div>

        <div>
          <Label htmlFor="price">Цена</Label>
          <Input id="price" name="price" type="number" required />
        </div>

        <div>
          <Label htmlFor="image">Картинка</Label>
          <Input id="image" name="image" type="file" accept="image/*" required />
        </div>

        {state?.error && (
          <p className="text-red-500 text-sm">{state.error}</p>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Загрузка..." : "Добавить"}
        </Button>
      </form>
    </div>
  )
}