"use server"

import { createClient } from "@/lib/server"
import { revalidatePath } from "next/cache"

export async function getSlots() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("delivery_slots")
    .select("*")
    .order("id", { ascending: true })

  if (error) {
    console.error("Ошибка при загрузке слотов:", error)
    return []
  }

  return data || []
}


export async function addSlot(timeRange: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("delivery_slots")
    .insert({ time_range: timeRange, available: true })
    .select()
    .single()

  if (error) return { error: error.message }

  return { data } // 🔥 возвращаем новый слот
}

export async function toggleSlot(id: number, available: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("delivery_slots")
    .update({ available: !available })
    .eq("id", id)

  if (error) return { error: error.message }

  return { success: true }
}

// 🔹 Удаление слота
export async function deleteSlot(id: number) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("delivery_slots")
    .delete()
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin")
  return { success: true }
}