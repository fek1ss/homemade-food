"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/server"
import { createAdminClient } from "@/lib/admin"

// 🔹 Получение всех продуктов
export async function getProducts() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return data || []
}

// 🔹 Получение продукта по ID
export async function getProductById(id: number | string) {
  const supabase = await createClient()
  const numericId = Number(id)

  if (isNaN(numericId)) return null

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", numericId)
    .single()

  if (error) {
    console.log("Ошибка загрузки продукта:", error.message)
    return null
  }

  return data
}

// 🔹 Добавление продукта
export async function addProduct(prevData: any, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number(formData.get("price"))
  const file = formData.get("image") as File

  if (!name.trim()) return { error: "Название не может быть пустым" }
  if (!file || file.size === 0) return { error: "Изображение обязательно" }

  // 🔥 фикс имени файла (убираем кириллицу и пробелы)
  const fileExt = file.name.split(".").pop()
  const safeName = `${Date.now()}.${fileExt}` // только timestamp
  const filePath = `products/${safeName}`

  // 🔹 upload оригинального файла (без сжатия)
  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      contentType: file.type,
    })

  if (uploadError) {
    console.log("UPLOAD ERROR:", uploadError)
    return { error: uploadError.message }
  }

  // 🔹 получаем публичный URL
  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath)

  // 🔹 сохраняем в БД
  const { error: insertError } = await supabase.from("products").insert({
    name,
    description,
    price,
    image: data.publicUrl,
    available: true,
  })

  if (insertError) {
    console.log("INSERT ERROR:", insertError)
    return { error: insertError.message }
  }

  // 🔄 обновляем страницы
  revalidatePath("/")
  revalidatePath("/admin")

  return { success: true }
}


// 🔹 Удаление продукта
export async function deleteProduct(prevState: any, formData: FormData) {
  const supabase = await createAdminClient()

  const id = Number(formData.get("id"))
  if (!id) return { error: "Invalid ID" }

  // 1. Получаем продукт
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("image")
    .eq("id", id)
    .single()

  if (fetchError) return { error: fetchError.message }

  

  // 2. Удаляем картинку
  if (product?.image) {
    try {
      const parts = product.image.split("/product-images/")

      if (parts[1]) {
        const filePath = parts[1] // products/xxx.jpg

        const { error: storageError } = await supabase.storage
          .from("product-images")
          .remove([filePath])
        
        console.log("DELETE STORAGE ERROR:", storageError)
        console.log("IMAGE URL:", product.image)
        console.log("FILE PATH:", filePath)
          
        if (storageError) {
          console.error("Ошибка удаления файла:", storageError.message)
        }
      }
    } catch (err) {
      console.error("Ошибка обработки пути:", err)
    }
  }

  // 3. Удаляем из БД
  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .eq("id", id)

  if (deleteError) return { error: deleteError.message }

  revalidatePath("/admin")
  revalidatePath("/")

  return { success: true }
}

// 🔹 Переключение доступности
export async function toggleProductAvailability(
  prevData: any,
  formData: FormData,
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const id = Number(formData.get("id"))
  const current = formData.get("available") === "true"

  const { error } = await supabase
    .from("products")
    .update({ available: !current })
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin")
  revalidatePath("/")

  return { success: true }
}

// 🔹 Обновление продукта
export async function updateProduct(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const id = Number(formData.get("id"))
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number(formData.get("price"))

  if (!id) return { error: "Invalid ID" }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
    })
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin")

  return { success: true }
}