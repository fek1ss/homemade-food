"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User, AuthState, UserRole } from "@/types"
import { supabase } from "@/lib/supabase"

// Интерфейс для контекста аутентификации
interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, role: UserRole) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserRole: (userId: string, role: UserRole) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
  getUsers: () => Promise<User[]>
  isAdmin: boolean
  isCashier: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Провайдер контекста аутентификации
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  // Проверка сессии при загрузке приложения
  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) throw error

        if (session?.user) {
          // Получаем профиль пользователя из таблицы users
          const { data: userProfile, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (userError) throw userError

          setAuthState({
            user: {
              id: userProfile.id,
              email: userProfile.email,
              role: userProfile.role,
              created_at: userProfile.created_at,
            },
            loading: false,
            error: null,
          })
        } else {
          setAuthState({ user: null, loading: false, error: null })
        }
      } catch (error: any) {
        setAuthState({ user: null, loading: false, error: error.message })
      }
    }

    getSession()

    // Слушаем изменения состояния аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const { data: userProfile, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (!error && userProfile) {
            setAuthState({
              user: {
                id: userProfile.id,
                email: userProfile.email,
                role: userProfile.role,
                created_at: userProfile.created_at,
              },
              loading: false,
              error: null,
            })
          }
        } else if (event === "SIGNED_OUT") {
          setAuthState({ user: null, loading: false, error: null })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Регистрация нового пользователя
  const signUp = async (email: string, password: string, role: UserRole): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error

      if (data.user) {
        // Добавляем профиль в таблицу users с ролью
        const { error: insertError } = await supabase
          .from("users")
          .insert([{ id: data.user.id, email, role }])

        if (insertError) throw insertError

        setAuthState({
          user: {
            id: data.user.id,
            email,
            role,
            created_at: new Date().toISOString(),
          },
          loading: false,
          error: null,
        })
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }))
      throw error
    }
  }

  // Вход пользователя
  const signIn = async (email: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      // Профиль подтянется автоматически через onAuthStateChange
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }))
      throw error
    }
  }

  // Выход пользователя
  const signOut = async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setAuthState({ user: null, loading: false, error: null })
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }))
      throw error
    }
  }

  // Обновление роли пользователя (только админ)
  const updateUserRole = async (userId: string, role: UserRole): Promise<void> => {
    if (authState.user?.role !== "admin") {
      throw new Error("Недостаточно прав для изменения роли пользователя")
    }

    const { error } = await supabase.from("users").update({ role }).eq("id", userId)
    if (error) throw error
  }

  // Удаление пользователя (только админ)
  const deleteUser = async (userId: string): Promise<void> => {
    if (authState.user?.role !== "admin") {
      throw new Error("Недостаточно прав для удаления пользователя")
    }

    const { error } = await supabase.from("users").delete().eq("id", userId)
    if (error) throw error
  }

  // Получение всех пользователей (только админ)
  const getUsers = async (): Promise<User[]> => {
    if (authState.user?.role !== "admin") {
      throw new Error("Недостаточно прав для просмотра пользователей")
    }

    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })
    if (error) throw error
    return data || []
  }

  // Создаём объект со всеми методами и состояниями для провайдера
  const value: AuthContextType = {
    ...authState,
    signUp,
    signIn,
    signOut,
    updateUserRole,
    deleteUser,
    getUsers,
    isAdmin: authState.user?.role === "admin",
    isCashier: authState.user?.role === "cashier",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Хук для использования контекста аутентификации
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}