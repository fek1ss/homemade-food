"use client"

import { deleteUser, updateUser } from "@/actions/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function UserList({
  users,
  currentUser,
}: {
  users: any[]
  currentUser: any
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set()) // для кнопки "Сохранить"

  const handleDelete = async (userId: string) => {
    if (deletingIds.has(userId)) return
    setDeletingIds((prev) => new Set(prev).add(userId))

    try {
      await deleteUser(userId)
      // 🔹 тут можно обновить список через refetch или state, если передан через props
    } catch (err) {
      console.error("Ошибка удаления пользователя:", err)
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const handleUpdate = async (formData: FormData) => {
    const id = formData.get("id") as string
    if (!id) return
    if (savingIds.has(id)) return

    setSavingIds((prev) => new Set(prev).add(id))

    try {
      await updateUser(formData)
      setEditingId(null) // 🔹 закрываем панель редактирования после успешного обновления
    } catch (err) {
      console.error("Ошибка обновления пользователя:", err)
    } finally {
      setSavingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {users.map((user) => {
        const isMe = user.id === currentUser?.id
        const isDeleting = deletingIds.has(user.id)
        const isSaving = savingIds.has(user.id)

        return (
          <div key={user.id} className="border p-4 rounded-lg flex flex-col gap-2">
            {editingId === user.id ? (
              <form
                className="flex flex-col gap-2"
                onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  await handleUpdate(formData)
                }}
              >
                <input type="hidden" name="id" value={user.id} />

                <Input name="email" defaultValue={user.email} />
                <Input name="password" placeholder="Новый пароль (необязательно)" />

                <div className="flex gap-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Сохраняем..." : "Сохранить"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingId(null)}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{user.email}</p>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingId(user.id)}
                  >
                    Редактировать
                  </Button>

                  {!isMe && (
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(user.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Удаление..." : "Удалить"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}