"use client"

import { useActionState } from "react"
import { createUser } from "@/actions/user"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const initialState = { error: "" }

export function AddUserForm() {
  const [state, formAction] = useActionState(createUser, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Input name="email" placeholder="Email" required />
      <Input name="password" type="password" placeholder="Пароль" required />

      <select
        name="role"
        className="border rounded-md p-2"
        defaultValue="cashier"
      >
        <option value="cashier">Кассир</option>
        <option value="admin">Админ</option>
      </select>

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <Button type="submit">Создать пользователя</Button>
    </form>
  )
}