"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/server"

// Получение всех продуктов
export async function getProducts() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

// Получение продукта по ID
export async function getProductById(id: number | string) {
  const supabase = await createClient()
  const numericId = Number(id) // 🔹

  if (isNaN(numericId)) return null

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", numericId)
    .single()

  if (error) {
    console.log("Ошибка при загрузке продукта:", JSON.stringify(error))
    return null
  }

  return data
}

// Добавление нового продукта
export async function addProduct(prevData: any, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number(formData.get("price"))
  const file = formData.get("image") as File

  if (!name.trim()) {
    return { error: "Название не может быть пустым" }
  }

  if (!file || file.size === 0) {
    return { error: "Изображение обязательно" }
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `products/${fileName}`

  // 🚀 upload
  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      contentType: file.type,
    })

  if (uploadError) {
    console.log("UPLOAD ERROR:", uploadError)
    return { error: uploadError.message }
  }

  // 🔗 url
  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath)

  // 💾 insert
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

  revalidatePath("/")
  return { success: true }
}

// УДАЛЕНИЕ ПРОДУКТА
export async function deleteProduct(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const id = Number(formData.get("id"))

  // 1. Получаем продукт
  const { data: product } = await supabase
    .from("products")
    .select("image")
    .eq("id", id)
    .single()

  // 2. Удаляем картинку из storage
  if (product?.image) {
    // ⚠️ ВАЖНО: тут должен быть ТОЛЬКО путь, не полный URL
    const filePath = product.image.split("/storage/v1/object/public/")[1]

    if (filePath) {
      await supabase.storage
        .from("product-images") // имя bucket
        .remove([filePath])
    }
  }

  // 3. Удаляем из БД
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

// ОБНОВЛЕНИЕ НАЛИЧИЯ
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
  return { success: true }
}

// ОБНОВЛЕНИЕ ПРОДУКТА
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
