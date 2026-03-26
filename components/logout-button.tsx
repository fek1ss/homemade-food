'use client'

import { signOut } from "@/actions/auth"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  return (
    <form action={signOut}>
      <Button variant="destructive">
        Выйти
      </Button>
    </form>
  )
}