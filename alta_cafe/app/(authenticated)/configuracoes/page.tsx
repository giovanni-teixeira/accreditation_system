'use client'

import { useState } from 'react'
import { 
  Calendar, 
  Users, 
  Sliders,
  Save,
  Plus,
  Trash2,
  Edit,
  Shield,
  UserCog,
  Check,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { evento as eventoData } from '@/lib/mock-data'
import type { PerfilAcesso, UsuarioAdmin } from '@/lib/types'

// State inicial de usuários
const usuariosIniciais: UsuarioAdmin[] = [
  { id: 'usr-001', nome: 'Administrador', login: 'admin', senha: 'admin123', email: 'admin@altacafe.com.br', perfilAcesso: 'ADMIN', ativo: true },
]

const perfilLabels: Record<PerfilAcesso, string> = {
  ADMIN: 'Administrador',
  COMISSAO_ORGANIZADORA: 'Comissão Organizadora',
  COLABORADOR_TERCEIRIZADO: 'Colaborador Terceirizado',
}

export default function ConfiguracoesPage() {
  const [isSaving, setIsSaving] = useState(false)
  
  // Dados do Evento
  const [nomeEvento, setNomeEvento] = useState(eventoData.nomeEvento)
  const [localEvento, setLocalEvento] = useState(eventoData.local)
  const [dataInicio, setDataInicio] = useState(eventoData.dataInicio)
  const [dataFim, setDataFim] = useState(eventoData.dataFim)
  const [descricao, setDescricao] = useState('A maior feira de café do Brasil, reunindo cafeicultores, expositores e profissionais do setor.')

  // Configurações de Credenciamento
  const [autoCredenciamento, setAutoCredenciamento] = useState(true)
  const [enviarEmail, setEnviarEmail] = useState(true)
  const [limiteExpositores, setLimiteExpositores] = useState('200')
  const [limiteCafeicultores, setLimiteCafeicultores] = useState('500')
  const [limiteVisitantes, setLimiteVisitantes] = useState('1000')
  const [limiteImprensa, setLimiteImprensa] = useState('100')

  // Usuários
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>(usuariosIniciais)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UsuarioAdmin | null>(null)
  const [newUserNome, setNewUserNome] = useState('')
  const [newUserLogin, setNewUserLogin] = useState('')
  const [newUserSenha, setNewUserSenha] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPerfil, setNewUserPerfil] = useState<PerfilAcesso>('COLABORADOR_TERCEIRIZADO')

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast.success('Configurações salvas com sucesso!')
  }

  const handleAddUser = () => {
    if (!newUserNome || !newUserLogin || !newUserSenha || !newUserEmail) {
      toast.error('Preencha todos os campos')
      return
    }

    if (editingUser) {
      // Editar usuário existente
      setUsuarios(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { ...u, nome: newUserNome, login: newUserLogin, senha: newUserSenha, email: newUserEmail, perfilAcesso: newUserPerfil }
          : u
      ))
      toast.success('Usuário atualizado com sucesso!')
    } else {
      // Adicionar novo usuário
      const newUser: UsuarioAdmin = {
        id: `usr-${Date.now()}`,
        nome: newUserNome,
        login: newUserLogin,
        senha: newUserSenha,
        email: newUserEmail,
        perfilAcesso: newUserPerfil,
        ativo: true,
      }
      setUsuarios(prev => [...prev, newUser])
      toast.success('Usuário adicionado com sucesso!')
    }

    resetUserForm()
    setIsUserDialogOpen(false)
  }

  const handleEditUser = (user: UsuarioAdmin) => {
    setEditingUser(user)
    setNewUserNome(user.nome)
    setNewUserLogin(user.login)
    setNewUserSenha(user.senha)
    setNewUserEmail(user.email)
    setNewUserPerfil(user.perfilAcesso)
    setIsUserDialogOpen(true)
  }

  const handleDeleteUser = (userId: string) => {
    if (userId === 'usr-001') {
      toast.error('Não é possível remover o administrador principal')
      return
    }
    setUsuarios(prev => prev.filter(u => u.id !== userId))
    toast.success('Usuário removido com sucesso!')
  }

  const handleToggleUserStatus = (userId: string) => {
    if (userId === 'usr-001') {
      toast.error('Não é possível desativar o administrador principal')
      return
    }
    setUsuarios(prev => prev.map(u => 
      u.id === userId ? { ...u, ativo: !u.ativo } : u
    ))
    toast.success('Status do usuário atualizado!')
  }

  const resetUserForm = () => {
    setEditingUser(null)
    setNewUserNome('')
    setNewUserLogin('')
    setNewUserSenha('')
    setNewUserEmail('')
    setNewUserPerfil('COLABORADOR_TERCEIRIZADO')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema e do evento
        </p>
      </div>

      <Tabs defaultValue="evento" className="space-y-6">
        <TabsList className="bg-muted/50 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="evento" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Evento</span>
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="credenciamento" className="gap-2">
            <Sliders className="h-4 w-4" />
            <span className="hidden sm:inline">Credenciamento</span>
          </TabsTrigger>
        </TabsList>

        {/* Evento Tab */}
        <TabsContent value="evento" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Evento</CardTitle>
              <CardDescription>
                Informações gerais sobre o evento Alta Café 2026
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nomeEvento">Nome do Evento</Label>
                  <Input
                    id="nomeEvento"
                    value={nomeEvento}
                    onChange={(e) => setNomeEvento(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localEvento">Local</Label>
                  <Input
                    id="localEvento"
                    value={localEvento}
                    onChange={(e) => setLocalEvento(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dataInicio">Data de Início</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataFim">Data de Término</Label>
                  <Input
                    id="dataFim"
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descrição do evento..."
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </TabsContent>

        {/* Usuários Tab */}
        <TabsContent value="usuarios" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Usuários da Organização</CardTitle>
                <CardDescription>
                  Gerencie os usuários com acesso ao painel administrativo
                </CardDescription>
              </div>
              <Dialog open={isUserDialogOpen} onOpenChange={(open) => {
                setIsUserDialogOpen(open)
                if (!open) resetUserForm()
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
                      {editingUser ? 'Atualize os dados do usuário' : 'Adicione um novo usuário ao sistema'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="userNome">Nome Completo</Label>
                      <Input
                        id="userNome"
                        value={newUserNome}
                        onChange={(e) => setNewUserNome(e.target.value)}
                        placeholder="Nome do usuário"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userEmail">E-mail</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="email@exemplo.com"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="userLogin">Login</Label>
                        <Input
                          id="userLogin"
                          value={newUserLogin}
                          onChange={(e) => setNewUserLogin(e.target.value)}
                          placeholder="login"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userSenha">Senha</Label>
                        <Input
                          id="userSenha"
                          type="password"
                          value={newUserSenha}
                          onChange={(e) => setNewUserSenha(e.target.value)}
                          placeholder="********"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userPerfil">Perfil de Acesso</Label>
                      <Select value={newUserPerfil} onValueChange={(v) => setNewUserPerfil(v as PerfilAcesso)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o perfil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Administrador</SelectItem>
                          <SelectItem value="COMISSAO_ORGANIZADORA">Comissão Organizadora</SelectItem>
                          <SelectItem value="COLABORADOR_TERCEIRIZADO">Colaborador Terceirizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddUser}>
                      {editingUser ? 'Salvar' : 'Adicionar'}
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
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden sm:table-cell">E-mail</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">
                          <div>
                            {usuario.nome}
                            <p className="text-xs text-muted-foreground sm:hidden">{usuario.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{usuario.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="whitespace-nowrap">
                            {usuario.perfilAcesso === 'ADMIN' && <Shield className="mr-1 h-3 w-3" />}
                            {usuario.perfilAcesso === 'COMISSAO_ORGANIZADORA' && <UserCog className="mr-1 h-3 w-3" />}
                            <span className="hidden sm:inline">{perfilLabels[usuario.perfilAcesso]}</span>
                            <span className="sm:hidden">
                              {usuario.perfilAcesso === 'ADMIN' ? 'Admin' : 
                               usuario.perfilAcesso === 'COMISSAO_ORGANIZADORA' ? 'Comissão' : 'Colab.'}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleUserStatus(usuario.id)}
                            className={usuario.ativo ? 'text-green-600' : 'text-muted-foreground'}
                          >
                            {usuario.ativo ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                            <span className="ml-1 hidden sm:inline">{usuario.ativo ? 'Ativo' : 'Inativo'}</span>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(usuario)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive"
                              onClick={() => handleDeleteUser(usuario.id)}
                              disabled={usuario.id === 'usr-001'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Credenciamento Tab */}
        <TabsContent value="credenciamento" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Credenciamento</CardTitle>
              <CardDescription>
                Configure como os credenciamentos são processados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Permitir Auto-Credenciamento</Label>
                  <p className="text-sm text-muted-foreground">
                    Visitantes podem se cadastrar diretamente pelo site
                  </p>
                </div>
                <Switch
                  checked={autoCredenciamento}
                  onCheckedChange={setAutoCredenciamento}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enviar E-mail de Confirmação</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar credenciados por e-mail após o cadastro
                  </p>
                </div>
                <Switch
                  checked={enviarEmail}
                  onCheckedChange={setEnviarEmail}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limites por Categoria</CardTitle>
              <CardDescription>
                Defina o número máximo de credenciados por categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Expositores</Label>
                  <Input 
                    type="number" 
                    value={limiteExpositores}
                    onChange={(e) => setLimiteExpositores(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cafeicultores</Label>
                  <Input 
                    type="number" 
                    value={limiteCafeicultores}
                    onChange={(e) => setLimiteCafeicultores(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Visitantes</Label>
                  <Input 
                    type="number" 
                    value={limiteVisitantes}
                    onChange={(e) => setLimiteVisitantes(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Imprensa</Label>
                  <Input 
                    type="number" 
                    value={limiteImprensa}
                    onChange={(e) => setLimiteImprensa(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
