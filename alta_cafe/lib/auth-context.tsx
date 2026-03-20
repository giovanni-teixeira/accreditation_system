'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authService, IUsuario } from './api.service'
import { STORAGE_KEYS } from './api-config'

interface AuthContextType {
  user: IUsuario | null
  token: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
  isLeitorCatraca: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUsuario | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Restaurar sessão salva
    const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN)
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER)

    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // O backend espera { login, senhaHash }. O api.service já cuida disso.
      const response = await authService.login(username, password)

      setToken(response.access_token)
      setUser(response.user)

      // Salvar no localStorage para persistir entre reloads
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.access_token)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))

      return true
    } catch (error) {
      console.error('[AuthContext] Erro no login:', error)
      return false
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }

  const isAdmin = user?.perfilAcesso === 'ADMIN'
  const isLeitorCatraca = user?.perfilAcesso === 'LEITOR_CATRACA'

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, isLeitorCatraca }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}