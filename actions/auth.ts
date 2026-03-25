'use server'

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";

export async function signUp(prevData: any,formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const {error} = await supabase.auth.signUp({
    email, 
    password
  })

  if(error) {
    return {error: error.message}
  }

  revalidatePath("/")
  redirect("/")
}


// export async function signUp(prevData: any, formData: FormData) {
//   const supabase = await createClient();

//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;
//   const role = formData.get("role") as string; // читаем роль из формы

//   // создаём пользователя с записью роли в user_metadata
//   const { data: userData, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: { role } // <-- сохраняем роль сразу в metadata
//     }
//   });

//   if (error) {
//     return { error: error.message };
//   }

//   // ❗ ВАЖНО: после server action redirect сессия на клиенте ещё не будет доступна
//   revalidatePath("/");
//   redirect("/");
// }

export async function signIn(prevData: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const {error} = await supabase.auth.signInWithPassword({
    email, 
    password
  })

  if(error) {
    return {error: error.message}
  }

  revalidatePath("/")
  redirect("/")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  revalidatePath("/")
  redirect("/login")
}