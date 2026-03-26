'use server'

import { createClient } from "@/lib/server"

export async function getSlots() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("delivery_slots")
    .select("*")
    .order("id", { ascending: true })

  if (error) return { error: error.message }

  return { data }
}

export async function addSlot(time_range: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("delivery_slots")
    .insert({ time_range, available: true })

  if (error) return { error: error.message }

  return { success: true }
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