'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authService, IUsuario } from './api.service'

interface AuthContextType {
  user: IUsuario | null
  token: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
  isLeitorCatraca: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'altacafe_token'
const USER_KEY = 'altacafe_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUsuario | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Restaurar sessão salva
    const savedToken = localStorage.getItem(TOKEN_KEY)
    const savedUser = localStorage.getItem(USER_KEY)

    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
        // Mantém o token acessível para o helper getAuthHeaders() do api.service
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(username, password)

      setToken(response.access_token)
      setUser(response.user)

      // Salvar no localStorage para persistir entre reloads
      // O helper getAuthHeaders() em api.service.ts lê daqui automaticamente
      localStorage.setItem(TOKEN_KEY, response.access_token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.user))

      return true
    } catch (error) {
      console.error('[AuthContext] Erro no login:', error)
      return false
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
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