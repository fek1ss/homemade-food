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

// export async function toggleAcceptOrders() {
//   const supabase = await createClient()

//   // получаем текущее значение
//   const { data, error } = await supabase
//     .from("settings")
//     .select("accept_orders")
//     .eq("id", 1)
//     .single()

//   if (error && error.code !== 'PGRST116') { // если ошибка не "not found"
//     console.error("Ошибка при получении текущего значения:", error)
//     return null
//   }

//   const currentValue = data?.accept_orders ?? false // дефолт false
//   const newValue = !currentValue

//   const { error: upsertError } = await supabase
//     .from("settings")
//     .upsert({ id: 1, accept_orders: newValue })

//   if (upsertError) {
//     console.error("Ошибка при обновлении accept_orders:", upsertError)
//     return currentValue
//   }

//   return newValue
// }

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