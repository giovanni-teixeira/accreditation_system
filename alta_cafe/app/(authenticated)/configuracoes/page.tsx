'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Plus,
  Trash2,
  Edit,
  Shield,
  ScanLine,
  Check,
  X,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { authService, usuariosService, IUsuario, PerfilAcesso } from '@/lib/api.service'

// ─── Config de perfis disponíveis ────────────────────────────────────────────
const perfisDisponiveis = [
  { value: PerfilAcesso.ADMIN,          label: 'Administrador',   icon: Shield  },
  { value: PerfilAcesso.LEITOR_CATRACA, label: 'Scanner (Catraca)', icon: ScanLine },
]

const perfilConfig: Record<string, { label: string; icon: React.ElementType }> = {
  [PerfilAcesso.ADMIN]:          { label: 'Administrador',    icon: Shield   },
  [PerfilAcesso.LEITOR_CATRACA]: { label: 'Scanner (Catraca)', icon: ScanLine },
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function ConfiguracoesPage() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<IUsuario | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formLogin, setFormLogin] = useState('')
  const [formSenha, setFormSenha] = useState('')
  const [formPerfil, setFormPerfil] = useState<PerfilAcesso>(PerfilAcesso.LEITOR_CATRACA)
  const [formSetor, setFormSetor] = useState('')

  // ── Carregar usuários ──────────────────────────────────────────────────────
  useEffect(() => {
    usuariosService.listar()
      .then(setUsuarios)
      .catch(() => toast.error('Erro ao carregar usuários.'))
      .finally(() => setIsLoading(false))
  }, [])

  // ── Reset form ────────────────────────────────────────────────────────────
  const resetForm = () => {
    setEditingUser(null)
    setFormLogin('')
    setFormSenha('')
    setFormPerfil(PerfilAcesso.LEITOR_CATRACA)
    setFormSetor('')
  }

  const handleOpenEdit = (user: IUsuario) => {
    setEditingUser(user)
    setFormLogin(user.login)
    setFormSenha('')
    setFormPerfil(user.perfilAcesso as PerfilAcesso)
    setFormSetor(user.setor ?? '')
    setIsDialogOpen(true)
  }

  // ── Criar ou editar usuário ───────────────────────────────────────────────
  const handleSave = async () => {
    if (!formLogin.trim()) return toast.error('Informe o login')
    if (!editingUser && !formSenha.trim()) return toast.error('Informe a senha')

    setIsSaving(true)
    try {
      if (editingUser) {
        // Editar — PATCH /usuarios/:id
        const atualizado = await usuariosService.atualizar(editingUser.id, {
          perfilAcesso: formPerfil,
          setor: formSetor || undefined,
          ...(formSenha ? { senhaPura: formSenha } : {}),
        })
        setUsuarios(prev => prev.map(u => u.id === editingUser.id ? atualizado : u))
        toast.success('Usuário atualizado com sucesso!')
      } else {
        // Criar — POST /auth/register
        const novo = await authService.register({
          login: formLogin,
          senhaPura: formSenha,
          perfilAcesso: formPerfil,
          setor: formSetor || undefined,
        })
        setUsuarios(prev => [...prev, novo])
        toast.success('Usuário criado com sucesso!')
      }

      resetForm()
      setIsDialogOpen(false)
    } catch (error: any) {
      toast.error(error.message ?? 'Erro ao salvar usuário.')
    } finally {
      setIsSaving(false)
    }
  }

  // ── Deletar usuário ───────────────────────────────────────────────────────
  const handleDelete = async (user: IUsuario) => {
    if (!confirm(`Tem certeza que deseja remover o usuário "${user.login}"?`)) return
    try {
      await usuariosService.deletar(user.id)
      setUsuarios(prev => prev.filter(u => u.id !== user.id))
      toast.success('Usuário removido com sucesso!')
    } catch (error: any) {
      toast.error(error.message ?? 'Erro ao remover usuário.')
    }
  }

  // ── Alterar perfil diretamente na tabela ──────────────────────────────────
  const handleTogglePerfil = async (user: IUsuario) => {
    const novoPerfil = user.perfilAcesso === PerfilAcesso.ADMIN
      ? PerfilAcesso.LEITOR_CATRACA
      : PerfilAcesso.ADMIN
    try {
      const atualizado = await usuariosService.atualizar(user.id, { perfilAcesso: novoPerfil })
      setUsuarios(prev => prev.map(u => u.id === user.id ? atualizado : u))
      toast.success('Perfil atualizado!')
    } catch (error: any) {
      toast.error(error.message ?? 'Erro ao atualizar perfil.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie os usuários com acesso ao sistema</p>
      </div>

      {/* Usuários */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usuários da Organização
            </CardTitle>
            <CardDescription>
              Administradores e operadores de scanner com acesso ao sistema
            </CardDescription>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                <DialogDescription>
                  {editingUser
                    ? 'Atualize o perfil ou a senha do usuário.'
                    : 'Crie um novo acesso ao sistema.'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Login — só exibe na criação */}
                {!editingUser && (
                  <div className="space-y-2">
                    <Label htmlFor="login">Login *</Label>
                    <Input
                      id="login"
                      value={formLogin}
                      onChange={(e) => setFormLogin(e.target.value)}
                      placeholder="nome_usuario"
                      autoComplete="off"
                    />
                  </div>
                )}

                {editingUser && (
                  <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Login</p>
                    <p className="font-medium text-foreground">{editingUser.login}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="senha">
                    {editingUser ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}
                  </Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formSenha}
                    onChange={(e) => setFormSenha(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perfil">Perfil de Acesso *</Label>
                  <Select value={formPerfil} onValueChange={(v) => setFormPerfil(v as PerfilAcesso)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      {perfisDisponiveis.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="setor">Setor (opcional)</Label>
                  <Input
                    id="setor"
                    value={formSetor}
                    onChange={(e) => setFormSetor(e.target.value)}
                    placeholder="Ex: Portaria, TI, Administração..."
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
                    : editingUser ? 'Salvar' : 'Criar Usuário'
                  }
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Login</TableHead>
                  <TableHead className="hidden sm:table-cell">Setor</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead className="hidden sm:table-cell">Criado em</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : usuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Nenhum usuário cadastrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  usuarios.map((usuario) => {
                    const config = perfilConfig[usuario.perfilAcesso]
                    const Icon = config?.icon ?? Shield
                    return (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">
                          <div>
                            {usuario.login}
                            <p className="text-xs text-muted-foreground sm:hidden">
                              {usuario.setor ?? '—'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {usuario.setor ?? '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="whitespace-nowrap gap-1">
                            <Icon className="h-3 w-3" />
                            <span className="hidden sm:inline">{config?.label ?? usuario.perfilAcesso}</span>
                            <span className="sm:hidden">
                              {usuario.perfilAcesso === PerfilAcesso.ADMIN ? 'Admin' : 'Scanner'}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {new Date(usuario.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEdit(usuario)}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(usuario)}
                              title="Remover"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}