'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { UsuarioAdmin, PerfilAcesso } from './types'
import { usuarioAdmin } from './mock-data'

interface AuthContextType {
  user: UsuarioAdmin | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
  isComissao: boolean
  isColaborador: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Usuários de teste para diferentes perfis
const testUsers: Record<string, UsuarioAdmin> = {
  'admin': {
    ...usuarioAdmin,
    perfilAcesso: 'ADMIN',
  },
  'comissao': {
    id: 'usr-002',
    nome: 'Maria Comissão',
    login: 'comissao',
    senha: 'comissao123',
    email: 'comissao@altacafe.com.br',
    perfilAcesso: 'COMISSAO_ORGANIZADORA',
    ativo: true,
  },
  'colaborador': {
    id: 'usr-003',
    nome: 'José Colaborador',
    login: 'colaborador',
    senha: 'colaborador123',
    email: 'colaborador@altacafe.com.br',
    perfilAcesso: 'COLABORADOR_TERCEIRIZADO',
    ativo: true,
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UsuarioAdmin | null>(null)

  useEffect(() => {
    // Verificar se há usuário salvo no sessionStorage
    const savedUser = sessionStorage.getItem('altacafe_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        sessionStorage.removeItem('altacafe_user')
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Verificar credenciais
    const foundUser = Object.values(testUsers).find(
      u => u.login === username && u.senha === password
    )

    if (foundUser) {
      setUser(foundUser)
      sessionStorage.setItem('altacafe_user', JSON.stringify(foundUser))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('altacafe_user')
  }

  const isAdmin = user?.perfilAcesso === 'ADMIN'
  const isComissao = user?.perfilAcesso === 'COMISSAO_ORGANIZADORA'
  const isColaborador = user?.perfilAcesso === 'COLABORADOR_TERCEIRIZADO'

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isComissao, isColaborador }}>
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
