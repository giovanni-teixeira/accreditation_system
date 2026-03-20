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
  Search,
  History,
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
import { authService, usuariosService, scansService, IUsuario, IScannerActivity, IScanLog, PerfilAcesso } from '@/lib/api.service'

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
  const [atividades, setAtividades] = useState<IScannerActivity[]>([])
  const [logs, setLogs] = useState<IScanLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingAtividades, setIsLoadingAtividades] = useState(true)
  const [isSearchingLogs, setIsSearchingLogs] = useState(false)
  const [searchNome, setSearchNome] = useState('')
  const [selectedScanner, setSelectedScanner] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<IUsuario | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formLogin, setFormLogin] = useState('')
  const [formSenha, setFormSenha] = useState('')
  const [formPerfil, setFormPerfil] = useState<PerfilAcesso>(PerfilAcesso.LEITOR_CATRACA)
  const [formSetor, setFormSetor] = useState('')

  // ── Carregar dados iniciais ────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      usuariosService.listar().then(setUsuarios),
      scansService.listarAtividades().then(setAtividades),
      scansService.listarLogs({ limit: 10 }).then(setLogs)
    ])
      .catch(() => toast.error('Erro ao carregar dados organizacional ou de scans.'))
      .finally(() => {
        setIsLoading(false)
        setIsLoadingAtividades(false)
      })
  }, [])

  // ── Busca em Tempo Real (Debounce) ─────────────────────────────────────────
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!isLoadingAtividades) {
        handleSearchLogs();
      }
    }, 400); // 400ms delay para busca fluida

    return () => clearTimeout(handler);
  }, [searchNome, selectedScanner]);

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
        const atualizado = await usuariosService.atualizar(editingUser.id, {
          perfilAcesso: formPerfil,
          setor: formSetor || undefined,
          ...(formSenha ? { senhaPura: formSenha } : {}),
        })
        setUsuarios(prev => prev.map(u => u.id === editingUser.id ? atualizado : u))
        toast.success('Usuário atualizado com sucesso!')
      } else {
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

  const handleSearchLogs = async () => {
    setIsSearchingLogs(true)
    try {
      const results = await scansService.listarLogs({ 
        nome: searchNome,
        scannerId: selectedScanner === 'all' ? undefined : selectedScanner,
        limit: 30 
      })
      setLogs(results)
    } catch (error: any) {
      // Falha silenciosa na busca automática para não interromper a digitação
    } finally {
      setIsSearchingLogs(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Configurações</h1>
          <p className="text-muted-foreground text-sm">Gerencie os usuários e audite as atividades de captura</p>
        </div>
        {isSearchingLogs && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
      </div>

      {/* Usuários */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usuários da Organização
            </CardTitle>
            <CardDescription>Operadores de scanner e administradores</CardDescription>
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
                  {editingUser ? 'Atualize o perfil do usuário.' : 'Crie um novo acesso.'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {!editingUser && (
                  <div className="space-y-2">
                    <Label htmlFor="login">Login *</Label>
                    <Input
                      id="login"
                      value={formLogin}
                      onChange={(e) => setFormLogin(e.target.value)}
                      placeholder="nome_usuario"
                    />
                  </div>
                )}

                {editingUser && (
                  <div className="rounded-lg border bg-muted/30 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Login</p>
                    <p className="font-medium">{editingUser.login}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="senha">{editingUser ? 'Nova Senha (opcional)' : 'Senha *'}</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formSenha}
                    onChange={(e) => setFormSenha(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perfil">Perfil *</Label>
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
                  <Label htmlFor="setor">Setor</Label>
                  <Input
                    id="setor"
                    value={formSetor}
                    onChange={(e) => setFormSetor(e.target.value)}
                    placeholder="Ex: Portaria..."
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : editingUser ? 'Salvar' : 'Criar'}
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
                  <TableHead className="hidden sm:table-cell text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
                ) : usuarios.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">Nenhum usuário.</TableCell></TableRow>
                ) : (
                  usuarios.map((usuario) => {
                    const config = perfilConfig[usuario.perfilAcesso]
                    const Icon = config?.icon ?? Shield
                    return (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.login}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{usuario.setor || '—'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="gap-1">
                            <Icon className="h-3 w-3" />
                            {config?.label || usuario.perfilAcesso}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(usuario)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(usuario)}><Trash2 className="h-4 w-4" /></Button>
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

      {/* Atividade dos Scanners */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5" />
            Atividade dos Scanners
          </CardTitle>
          <CardDescription>Resumo de produtividade acumulada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leitor (Login)</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-right">Última</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingAtividades ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
                ) : atividades.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">Sem atividades.</TableCell></TableRow>
                ) : (
                  atividades.map((atv) => (
                    <TableRow key={atv.scannerId}>
                      <TableCell className="font-medium">{atv.scannerName}</TableCell>
                      <TableCell className="text-muted-foreground">{atv.setor}</TableCell>
                      <TableCell className="text-center font-bold text-primary">{atv.totalScans}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {atv.lastScanAt ? new Date(atv.lastScanAt).toLocaleString('pt-BR') : '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Histórico e Busca Técnica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico e Busca Técnica
          </CardTitle>
          <CardDescription>Filtre o histórico de capturas por nome ou leitor em tempo real</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Filtrar por Leitor</Label>
              <Select value={selectedScanner} onValueChange={setSelectedScanner}>
                <SelectTrigger><SelectValue placeholder="Todos os scanners" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os scanners</SelectItem>
                  {usuarios
                    .filter(u => u.perfilAcesso === PerfilAcesso.LEITOR_CATRACA)
                    .map(u => <SelectItem key={u.id} value={u.id}>{u.login}</SelectItem>)
                  }
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="searchNome">Buscar por Nome Credenciado</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="searchNome"
                  placeholder="Digite para filtrar..."
                  value={searchNome}
                  onChange={(e) => setSearchNome(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scanner</TableHead>
                  <TableHead>Credenciado</TableHead>
                  <TableHead className="hidden md:table-cell">CPF/CNPJ</TableHead>
                  <TableHead className="text-right">Data/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isSearchingLogs ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
                ) : logs.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Nenhum resultado nos filtros.</TableCell></TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell><Badge variant="outline" className="font-mono text-[10px]">{log.scannerName}</Badge></TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{log.credenciadoNome}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{log.tipoCategoria || 'Visitante'}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{log.credenciadoCpf}</TableCell>
                      <TableCell className="text-right text-[10px]">{new Date(log.createdAt).toLocaleString('pt-BR')}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}