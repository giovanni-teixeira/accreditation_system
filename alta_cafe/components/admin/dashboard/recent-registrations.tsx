'use client'

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { TipoCategoria } from '@/lib/api.service'

const categoriasLabels: Record<TipoCategoria, string> = {
  EXPOSITOR: 'Expositor',
  VISITANTE: 'Visitante',
  PRODUTOR: 'Produtor',
  IMPRENSA: 'Imprensa',
  ORGANIZACAO: 'Organização',
  TERCEIRIZADO: 'Terceirizado',
}

const categoriaColors: Record<TipoCategoria, string> = {
  EXPOSITOR: '#0000FF',
  VISITANTE: '#8B008B',
  PRODUTOR: '#00FF00',
  IMPRENSA: '#778899',
  ORGANIZACAO: '#FF8C00',
  TERCEIRIZADO: '#DC143C',
}

interface RecentRegistration {
  id: string
  nomeCompleto: string
  tipoCategoria: TipoCategoria
  email: string
  createdAt: string
  credencial: { status: string } | null
}

interface RecentRegistrationsProps {
  data: RecentRegistration[]
}

export function RecentRegistrations({ data }: RecentRegistrationsProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Últimos Credenciamentos</h3>
        </div>
        <span className="text-sm text-muted-foreground">Recentes</span>
      </div>

      <div className="divide-y divide-border">
        {data.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            Nenhum credenciamento encontrado.
          </div>
        ) : (
          data.map((credenciado) => (
            <div
              key={credenciado.id}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{credenciado.nomeCompleto}</p>
                <p className="text-sm text-muted-foreground">{credenciado.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className={cn('font-medium text-white')}
                  style={{ backgroundColor: categoriaColors[credenciado.tipoCategoria] }}
                >
                  {categoriasLabels[credenciado.tipoCategoria]}
                </Badge>
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(credenciado.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}