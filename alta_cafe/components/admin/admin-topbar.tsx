'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  // Search, 
  // Bell, 
  Menu, 
  ChevronDown,
  LogOut,
  User,
  Settings,
  // Coffee,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { usuarioAdmin, evento } from '@/lib/mock-data'

interface AdminTopbarProps {
  onMobileMenuClick: () => void
}

export function AdminTopbar({ onMobileMenuClick }: AdminTopbarProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/admin/credenciados?busca=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    router.push('/login')
  }

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      {/* Mobile menu button & Event info */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Evento fixo - Alta Café 2026 */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <div className="flex h-8 w-auto items-center justify-center">
            <img src="/admin/ico_alta-cafe.png" alt="Logo Alta Café" className="mt-1 md-6 h-8 w-auto" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{evento.nomeEvento}</p>
            <p className="text-xs text-muted-foreground">{evento.local}</p>
          </div>
          <Badge variant="default" className="ml-2 hidden sm:inline-flex">
            Ativo
          </Badge>
        </div>
      </div>

      {/* Search */}
      {/* <form onSubmit={handleSearch} className="hidden flex-1 justify-center px-8 md:flex">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome, CPF ou e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-border bg-background pl-9"
          />
        </div>
      </form> */}

      {/* Actions */}
      <div className="flex items-center gap-2">

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  <img src="/admin/profile.png" alt="Logo Alta Café" className="md-7 h-8 w-auto" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start lg:flex">
                <span className="text-sm font-medium">{usuarioAdmin.nome}</span>
                <span className="text-xs text-muted-foreground">{usuarioAdmin.perfilAcesso}</span>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground lg:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/configuracoes')}>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
