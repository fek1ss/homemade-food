'use server'

import { createClient } from "@/lib/server"

export async function getUserRole() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      role: null,
      isAdmin: false,
      isCashier: false,
    }
  }

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle() // 🔥 важно

  if (error) {
    console.error("Ошибка получения роли:", error)
  }

  const role = data?.role ?? null

  return {
    role,
    isAdmin: role === "admin",
    isCashier: role === "cashier",
  }
}