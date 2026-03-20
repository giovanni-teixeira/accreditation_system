'use client'

import { useRouter } from 'next/navigation'
import { 
  Menu, 
  ChevronDown,
  LogOut,
  User,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useAuth } from '@/lib/auth-context'
import { evento } from '@/lib/mock-data'

interface AdminTopbarProps {
  onMobileMenuClick: () => void
}

export function AdminTopbar({ onMobileMenuClick }: AdminTopbarProps) {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const displayName = user?.login ? user.login.charAt(0).toUpperCase() + user.login.slice(1) : 'Usuário'

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

      {/* Actions */}
      <div className="flex items-center gap-2">

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs uppercase">
                  {user?.login?.substring(0, 2) || 'AD'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start lg:flex text-left">
                <span className="text-sm font-medium">{displayName}</span>
                <span className="text-xs text-muted-foreground uppercase opacity-70">
                  {user?.perfilAcesso || 'Perfil'}
                </span>
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
            <DropdownMenuItem onClick={handleLogout} className="text-destructive font-medium">
              <LogOut className="mr-2 h-4 w-4" />
              Sair da conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
