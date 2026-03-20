'use client'

import { useState } from 'react'
import { Search, ShieldCheck, User, Lock, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { credenciadosService, authService, ICredenciado, PerfilAcesso } from '@/lib/api.service'
import { categoriasLabels } from '@/lib/mock-data'

export default function PromoverUsuarioPage() {
  const [cpfBusca, setCpfBusca] = useState('')
  const [isBuscando, setIsBuscando] = useState(false)
  const [credenciado, setCredenciado] = useState<ICredenciado | null>(null)
  
  // Form de promoção
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [perfil, setPerfil] = useState<PerfilAcesso>(PerfilAcesso.LEITOR_CATRACA)
  const [setor, setSetor] = useState('')
  const [isPromovendo, setIsPromovendo] = useState(false)

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cpfBusca.trim()) return

    setIsBuscando(true)
    setCredenciado(null)
    
    try {
      const result = await credenciadosService.buscarPorCpf(cpfBusca)
      setCredenciado(result)
      // Sugerir login baseado no e-mail ou nome
      if (result.email) {
        setLogin(result.email.split('@')[0])
      }
    } catch (error: any) {
      toast.error(error.message || 'CPF não encontrado.')
    } finally {
      setIsBuscando(false)
    }
  }

  const handlePromover = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!credenciado) return

    if (!login.trim() || !senha.trim()) {
      toast.error('Preencha login e senha.')
      return
    }

    setIsPromovendo(true)
    try {
      await authService.promover({
        cpf: credenciado.cpf,
        login,
        senhaPura: senha,
        perfilAcesso: perfil,
        setor: setor || undefined,
      })
      toast.success('Usuário promovido com sucesso!')
      // Limpar formulário
      setCredenciado(null)
      setCpfBusca('')
      setLogin('')
      setSenha('')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao promover usuário.')
    } finally {
      setIsPromovendo(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Promover Usuário</h1>
        <p className="text-muted-foreground">
          Conceda acesso administrativo a um credenciado existente
        </p>
      </div>

      {/* Busca por CPF */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">1. Buscar Credenciado</CardTitle>
          <CardDescription>Digite o CPF para localizar o registro</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBuscar} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="000.000.000-00"
                value={cpfBusca}
                onChange={(e) => setCpfBusca(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit" disabled={isBuscando}>
              {isBuscando ? 'Buscando...' : 'Buscar'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resultado e Formulário de Promoção */}
      {credenciado && (
        <div className="grid gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-5 w-5" />
                <CardTitle className="text-lg">Credenciado Localizado</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Nome Completo</p>
                  <p className="font-semibold text-foreground uppercase">{credenciado.nomeCompleto}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Categoria</p>
                  <p className="font-medium text-foreground">
                    {categoriasLabels[credenciado.tipoCategoria] || credenciado.tipoCategoria}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="text-foreground">{credenciado.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">CPF</p>
                  <p className="text-foreground">{credenciado.cpf}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Configurar Acesso</CardTitle>
              <CardDescription>Defina as credenciais de login para este usuário</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePromover} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="login">Login (Usuário)</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        placeholder="ex: joao.silva"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="senha"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="••••••••"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="perfil">Perfil de Acesso</Label>
                    <Select value={perfil} onValueChange={(v) => setPerfil(v as PerfilAcesso)}>
                      <SelectTrigger id="perfil">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PerfilAcesso.ADMIN}>Administrador Total</SelectItem>
                        <SelectItem value={PerfilAcesso.LEITOR_CATRACA}>Leitor de Scanner (Portaria)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setor">Setor / Departamento</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="setor"
                        value={setor}
                        onChange={(e) => setSetor(e.target.value)}
                        placeholder="ex: SEGURANÇA"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto"
                    disabled={isPromovendo}
                  >
                    {isPromovendo ? (
                      'Processando...'
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Confirmar Promoção
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {!credenciado && !isBuscando && (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-xl">
          <AlertCircle className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Nenhum credenciado selecionado.</p>
          <p className="text-sm text-muted-foreground/60">Busque por um CPF acima para começar.</p>
        </div>
      )}
    </div>
  )
}
