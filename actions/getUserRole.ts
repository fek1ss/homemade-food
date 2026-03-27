"use server"

"use server"

import { createClient } from "@/lib/server"

export async function getUserRole() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let role: string | null = null

  if (user) {
    const { data: userData, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (error) {
      console.error("Ошибка получения роли:", error)
    }

    role = userData?.role ?? null
  }

  return {
    role,
    isAdmin: role === "admin",
    isCashier: role === "cashier",
  }
}
