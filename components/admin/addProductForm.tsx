'use client'

import { useActionState, useEffect, useRef, useState, useTransition } from "react"
import imageCompression from "browser-image-compression"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { addProduct } from "@/actions/products"

const initialState = { error: '' }

export function AddProductForm() {
  const [state, formAction] = useActionState(addProduct, initialState)
  const [isPending, startTransition] = useTransition()
  const [isCompressing, setIsCompressing] = useState(false)
  
  // 1. Создаем реф для формы
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isPending || isCompressing) return
    
    setIsCompressing(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const file = formData.get("image") as File
      if (file && file.size > 0) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        })
        formData.set("image", new File([compressedFile], file.name))
      }

      // 2. Вызываем экшен
      startTransition(() => {
        formAction(formData)
      })

      // 3. Очищаем форму вручную сразу после запуска
      // Если хочешь очищать ТОЛЬКО при успехе, придется ждать ответа от сервера,
      // но для мгновенной очистки это делается так:
      formRef.current?.reset()

    } catch (error) {
      console.error(error)
    } finally {
      setIsCompressing(false)
    }
  }

  return (
    <div className="mb-8 rounded-lg border border-border bg-card p-6">
      <h3 className="text-xl font-semibold mb-4">Добавить блюдо</h3>

      <form 
        ref={formRef} // 4. Привязываем реф
        onSubmit={handleSubmit} 
        className="space-y-4"
      >
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

        <Button type="submit" disabled={isPending || isCompressing}>
          {(isPending || isCompressing) ? "Загрузка..." : "Добавить"}
        </Button>
      </form>
    </div>
  )
}