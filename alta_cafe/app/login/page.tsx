'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Coffee, Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import logo from '../../public/altacafe.png'


type LoginState = 'idle' | 'loading' | 'error'

// Credenciais válidas 
const validCredentials = [
  { login: 'admin', senha: 'admin123', perfil: 'Administrador' },
  { login: 'comissao', senha: 'comissao123', perfil: 'Comissão Organizadora' },
  { login: 'colaborador', senha: 'colaborador123', perfil: 'Colaborador Terceirizado' },
]

export default function AdminLoginPage() {
  const router = useRouter()
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [state, setState] = useState<LoginState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!login.trim() || !senha.trim()) {
      setState('error')
      setErrorMessage('Preencha todos os campos')
      return
    }

    setState('loading')
    setErrorMessage('')

    // Simular autenticação
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verificar credenciais
    const foundUser = validCredentials.find(
      u => u.login === login && u.senha === senha
    )

    if (foundUser) {
      // Salvar usuário na sessionStorage
      sessionStorage.setItem('altacafe_user', JSON.stringify({
        login: foundUser.login,
        perfil: foundUser.perfil,
      }))
      toast.success(`Bem-vindo(a), ${foundUser.perfil}!`)
      router.push('/dashboard')
    } else {
      setState('error')
      setErrorMessage('Credenciais inválidas. Verifique seu login e senha.')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-primary/5" />
        <div className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-secondary/5" />
      </div>

      {/* Left decorative panel (visible on larger screens) */}
      <div className="absolute bottom-0 left-0 top-0 hidden w-1/3 bg-sidebar lg:block">
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
          <img src="/admin/altacafe.png" alt="Logo Alta Café" className="h-32 w-auto" />
          <div className="mt-6 max-w-xs">
            <p className="text-sm leading-relaxed text-sidebar-foreground/60">
              Gestão completa de credenciamento para o maior evento de café do Brasil.
            </p>
          </div>
        </div>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md lg:ml-auto lg:mr-[15%]">
        {/* Mobile logo */}
        <div className="mb-8 flex flex-col items-center lg:hidden">
          <img src="/admin/altacafe.png" alt="Logo Alta Café" className="h-32 w-auto" />
        </div>

        <Card className="border-border bg-card shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-foreground">
              Painel Administrativo
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Entre com suas credenciais de acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login" className="text-foreground">
                  Login
                </Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="seu.usuario"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="border-border bg-background"
                  disabled={state === 'loading'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="text-foreground">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="border-border bg-background pr-10"
                    disabled={state === 'loading'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={state === 'loading'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {state === 'error' && errorMessage && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={state === 'loading'}
              >
                {state === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Suporte da organização
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
