// actions/setting.ts
"use server"

import { createClient } from "@/lib/server"

export async function getAcceptOrders() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("settings")
    .select("accept_orders")
    .eq("id", 1)
    .single()

  if (error) {
    console.error("Ошибка при получении настройки:", error)
    return true // fallback
  }

  return data.accept_orders
}


export async function toggleAcceptOrders() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .rpc("accept_orders") // 👈 RPC функция

  if (error) {
    console.error(error)
    return null
  }

  return data
}