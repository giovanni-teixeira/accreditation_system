'use client'

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Users } from 'lucide-react'
import { credenciados } from '@/lib/mock-data'
import { categoriasLabels, categoriaColors } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function RecentRegistrations() {
  // Pegar os 5 credenciados mais recentes
  const recentCredenciados = [...credenciados]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Últimos Credenciamentos</h3>
        </div>
        <span className="text-sm text-muted-foreground">Hoje</span>
      </div>
      <div className="divide-y divide-border">
        {recentCredenciados.map((credenciado) => {
          const catColor = categoriaColors[credenciado.tipoCategoria]
          return (
            <div key={credenciado.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/50">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{credenciado.nomeCompleto}</p>
                <p className="text-sm text-muted-foreground">
                  {credenciado.municipio}/{credenciado.uf}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  variant="secondary" 
                  className={cn('font-medium', catColor.bg, catColor.text)}
                >
                  {categoriasLabels[credenciado.tipoCategoria]}
                </Badge>
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(credenciado.createdAt), { 
                    addSuffix: true,
                    locale: ptBR 
                  })}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
