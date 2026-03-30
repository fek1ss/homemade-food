"use server"

import { createClient } from "@/lib/server"
import { createAdminClient } from "@/lib/admin"
import { revalidatePath } from "next/cache"

// 🔹 Получить всех пользователей
export async function getUsers() {
  const supabase = createAdminClient() 

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return data || []
}

// 🔹 Получить текущего пользователя
export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

// 🔹 Создание пользователя
export async function createUser(prevState: any, formData: FormData) {
  const supabase = createAdminClient() 

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as "admin" | "cashier"

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

  if (authError) {
    return { error: authError.message }
  }

  await supabase.from("users").insert({
    id: authData.user.id,
    email,
    role,
  })

  return { success: true }
}

// 🔹 Удаление пользователя
export async function deleteUser(userId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user?.id === userId) {
    throw new Error("Нельзя удалить самого себя")
  }

  const admin = createAdminClient()

  await admin.auth.admin.deleteUser(userId)
  await admin.from("users").delete().eq("id", userId)

  revalidatePath("/admin")
}

// 🔹 Обновление пользователя
export async function updateUser(formData: FormData) {
  const supabase = await createAdminClient()

  const id = formData.get("id") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!id || !email) throw new Error("ID и email обязательны")

  // 🔹 обновляем email и password через админский клиент
  await supabase.auth.admin.updateUserById(id, {
    email,
    ...(password ? { password } : {}),
  })

  // 🔹 обновляем таблицу пользователей (если у тебя есть отдельная таблица)
  await supabase.from("users").update({ email }).eq("id", id)

  // 🔹 обновляем страницу после изменения
  revalidatePath("/admin")
}