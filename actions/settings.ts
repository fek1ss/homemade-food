// actions/setting.ts
'use server'

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

  // получаем текущее значение
  const { data, error } = await supabase
    .from("settings")
    .select("accept_orders")
    .eq("id", 1)
    .single()

  if (error) {
    console.error("Ошибка при получении текущего значения:", error)
    return null
  }

  const newValue = !data?.accept_orders

  await supabase
    .from("settings")
    .upsert({ id: 1, accept_orders: newValue })

  return newValue
}