"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { User, UserRole } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Users, Shield, UserCheck } from "lucide-react"
import { Loader2 } from "lucide-react"

export function UserManagement() {
  const { getUsers, updateUserRole, deleteUser, user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const userList = await getUsers()
      setUsers(userList)
    } catch (err: any) {
      setError(err.message || "Не удалось загрузить пользователей")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (userId === currentUser?.id) {
      setError("Нельзя изменить свою собственную роль")
      return
    }

    setUpdatingUser(userId)
    try {
      await updateUserRole(userId, newRole)
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      )
      setError(null)
    } catch (err: any) {
      setError(err.message || "Не удалось обновить роль")
    } finally {
      setUpdatingUser(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      setError("Нельзя удалить свой собственный аккаунт")
      return
    }

    if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      return
    }

    setUpdatingUser(userId)
    try {
      await deleteUser(userId)
      setUsers(prev => prev.filter(user => user.id !== userId))
      setError(null)
    } catch (err: any) {
      setError(err.message || "Не удалось удалить пользователя")
    } finally {
      setUpdatingUser(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Администраторов</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Кассиров</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'cashier').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Управление пользователями</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Создан: {new Date(user.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? 'Администратор' : 'Кассир'}
                  </Badge>
                  {user.id === currentUser?.id && (
                    <Badge variant="outline">Это вы</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={user.role}
                    onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}
                    disabled={updatingUser === user.id || user.id === currentUser?.id}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Администратор</SelectItem>
                      <SelectItem value="cashier">Кассир</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={updatingUser === user.id || user.id === currentUser?.id}
                  >
                    {updatingUser === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Нет пользователей
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}